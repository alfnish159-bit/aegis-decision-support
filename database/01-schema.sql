\set ON_ERROR_STOP on
BEGIN;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS aegis;
SET search_path = aegis, public;
CREATE TYPE resource_kind AS ENUM ('FIRE','MEDICAL','RESCUE','POLICE','GAS','POWER','VEHICLE');
CREATE TYPE audit_kind AS ENUM ('CREATED','STATUS_CHANGED','RESOURCE_ASSIGNED','RESOURCE_RELEASED');
CREATE TABLE app_user (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 username varchar(80) NOT NULL UNIQUE CHECK (btrim(username) <> ''),
 display_name varchar(120) NOT NULL CHECK (btrim(display_name) <> ''),
 role varchar(20) NOT NULL CHECK (role IN ('DISPATCHER','ADMIN')),
 active boolean NOT NULL DEFAULT true
);
CREATE TABLE incident_type (
 code varchar(20) PRIMARY KEY, name varchar(80) NOT NULL UNIQUE
);
CREATE TABLE severity (
 code varchar(10) PRIMARY KEY, label varchar(30) NOT NULL UNIQUE,
 priority smallint NOT NULL UNIQUE CHECK (priority BETWEEN 1 AND 4)
);
CREATE TABLE incident_status (
 code varchar(20) PRIMARY KEY, name varchar(30) NOT NULL UNIQUE,
 is_final boolean NOT NULL DEFAULT false,
 CHECK (is_final = (code = 'RESOLVED'))
);
CREATE TABLE reporter (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 display_name varchar(120) NOT NULL CHECK (btrim(display_name) <> ''),
 phone varchar(30) NOT NULL CHECK (phone ~ '^\+?[0-9 ()-]{7,30}$')
);
CREATE TABLE incident (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 number bigint GENERATED ALWAYS AS IDENTITY (START WITH 154) UNIQUE NOT NULL,
 type_code varchar(20) NOT NULL REFERENCES incident_type(code),
 severity_code varchar(10) NOT NULL REFERENCES severity(code),
 status_code varchar(20) NOT NULL DEFAULT 'NEW' REFERENCES incident_status(code),
 reporter_id uuid NOT NULL REFERENCES reporter(id),
 created_by uuid NOT NULL REFERENCES app_user(id),
 title varchar(120) NOT NULL CHECK (btrim(title) <> ''),
 description text NOT NULL CHECK (length(btrim(description)) BETWEEN 10 AND 4000),
 address varchar(200) NOT NULL CHECK (btrim(address) <> ''),
 location geography(Point,4326) NOT NULL CHECK (NOT ST_IsEmpty(location::geometry)),
 occurred_at timestamptz NOT NULL,
 registered_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 resolved_at timestamptz,
 CHECK (occurred_at <= registered_at),
 CHECK ((status_code = 'RESOLVED') = (resolved_at IS NOT NULL)),
 CHECK (resolved_at IS NULL OR resolved_at >= registered_at)
);
CREATE TABLE resource (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name varchar(120) NOT NULL UNIQUE CHECK (btrim(name) <> ''),
 kind resource_kind NOT NULL,
 capacity smallint NOT NULL CHECK (capacity BETWEEN 1 AND 100),
 location_name varchar(120) NOT NULL,
 maintenance boolean NOT NULL DEFAULT false
);
CREATE TABLE assignment (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 incident_id uuid NOT NULL REFERENCES incident(id),
 resource_id uuid NOT NULL REFERENCES resource(id),
 assigned_by uuid NOT NULL REFERENCES app_user(id),
 assigned_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 released_at timestamptz,
 UNIQUE (incident_id, resource_id, assigned_at),
 CHECK (released_at IS NULL OR released_at >= assigned_at)
);
CREATE UNIQUE INDEX uq_resource_active ON assignment(resource_id) WHERE released_at IS NULL;
CREATE INDEX ix_assignment_incident ON assignment(incident_id, assigned_at DESC);
CREATE INDEX ix_incident_active ON incident(severity_code, registered_at DESC) WHERE status_code <> 'RESOLVED';
CREATE INDEX ix_incident_type ON incident(type_code);
CREATE INDEX ix_incident_reporter ON incident(reporter_id);
CREATE INDEX ix_incident_location ON incident USING gist(location);
CREATE TABLE audit_log (
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 incident_id uuid NOT NULL REFERENCES incident(id),
 actor_id uuid NOT NULL REFERENCES app_user(id),
 event_type audit_kind NOT NULL,
 from_status varchar(20) REFERENCES incident_status(code),
 to_status varchar(20) REFERENCES incident_status(code),
 details text NOT NULL,
 occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 CHECK (event_type <> 'STATUS_CHANGED' OR (from_status IS NOT NULL AND to_status IS NOT NULL AND from_status <> to_status))
);
-- Separate event/assignment association avoids assignment_id -> incident_id in audit_log.
CREATE TABLE audit_assignment (
 audit_id bigint PRIMARY KEY REFERENCES audit_log(id),
 assignment_id uuid NOT NULL REFERENCES assignment(id)
);
CREATE INDEX ix_audit_assignment ON audit_assignment(assignment_id);
CREATE FUNCTION guard_audit_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM audit_log e JOIN assignment a ON a.id=NEW.assignment_id
  WHERE e.id=NEW.audit_id AND e.incident_id=a.incident_id
    AND e.event_type IN ('RESOURCE_ASSIGNED','RESOURCE_RELEASED')) THEN
  RAISE EXCEPTION 'Event and assignment must belong to the same incident' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER audit_assignment_guard BEFORE INSERT ON audit_assignment FOR EACH ROW EXECUTE FUNCTION guard_audit_assignment();
CREATE INDEX ix_audit_incident_time ON audit_log(incident_id, occurred_at, id);
-- Cross-row rules cannot be expressed with CHECK alone.
CREATE FUNCTION guard_assignment() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE s text; unavailable boolean;
BEGIN
 IF TG_OP = 'UPDATE' THEN
  IF NEW.incident_id <> OLD.incident_id OR NEW.resource_id <> OLD.resource_id OR NEW.assigned_at <> OLD.assigned_at OR NEW.assigned_by <> OLD.assigned_by OR (OLD.released_at IS NOT NULL AND NEW.released_at IS DISTINCT FROM OLD.released_at) THEN
   RAISE EXCEPTION 'Assignment identity/history cannot be changed' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
 END IF;
 SELECT status_code INTO s FROM incident WHERE id=NEW.incident_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Incident not found' USING ERRCODE='23503'; END IF;
 SELECT maintenance INTO unavailable FROM resource WHERE id=NEW.resource_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Resource not found' USING ERRCODE='23503'; END IF;
 IF s NOT IN ('CONFIRMED','RESPONDING','LOCALIZED') OR unavailable THEN
  RAISE EXCEPTION 'Incident not confirmed or resource under maintenance' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER assignment_guard BEFORE INSERT OR UPDATE ON assignment FOR EACH ROW EXECUTE FUNCTION guard_assignment();
CREATE FUNCTION guard_status() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP = 'INSERT' THEN
  IF NEW.status_code <> 'NEW' THEN RAISE EXCEPTION 'Incident must start as NEW' USING ERRCODE='23514'; END IF;
  RETURN NEW;
 END IF;
 IF NEW.status_code = OLD.status_code THEN RETURN NEW; END IF;
 IF NOT ((OLD.status_code='NEW' AND NEW.status_code='VERIFICATION') OR
 (OLD.status_code='VERIFICATION' AND NEW.status_code IN ('CONFIRMED','RESOLVED')) OR
 (OLD.status_code='CONFIRMED' AND NEW.status_code='RESPONDING') OR
 (OLD.status_code='RESPONDING' AND NEW.status_code='LOCALIZED') OR
 (OLD.status_code='LOCALIZED' AND NEW.status_code='RESOLVED')) THEN
  RAISE EXCEPTION 'Invalid incident transition: % -> %',OLD.status_code,NEW.status_code USING ERRCODE='23514';
 END IF;
 IF NEW.status_code='RESPONDING' AND NOT EXISTS (SELECT 1 FROM assignment WHERE incident_id=NEW.id AND released_at IS NULL) THEN
  RAISE EXCEPTION 'Resource required before responding' USING ERRCODE='23514';
 END IF;
 IF NEW.status_code='RESOLVED' THEN
  NEW.resolved_at=clock_timestamp();
  UPDATE assignment SET released_at=NEW.resolved_at WHERE incident_id=NEW.id AND released_at IS NULL;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER incident_guard BEFORE INSERT OR UPDATE OF status_code ON incident FOR EACH ROW EXECUTE FUNCTION guard_status();
CREATE FUNCTION protect_audit() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Audit log is append-only' USING ERRCODE='23514'; END $$;
CREATE TRIGGER audit_immutable BEFORE UPDATE OR DELETE ON audit_log FOR EACH ROW EXECUTE FUNCTION protect_audit();
CREATE TRIGGER audit_assignment_immutable BEFORE UPDATE OR DELETE ON audit_assignment FOR EACH ROW EXECUTE FUNCTION protect_audit();
CREATE VIEW incident_overview AS
SELECT i.id,i.number,i.title,i.address,t.name AS type,s.label AS severity,s.priority,st.name AS status,
 i.registered_at,ST_Y(i.location::geometry) AS lat,ST_X(i.location::geometry) AS lng,
 (SELECT count(*) FROM assignment a WHERE a.incident_id=i.id AND a.released_at IS NULL) AS active_resources
FROM incident i JOIN incident_type t ON t.code=i.type_code JOIN severity s ON s.code=i.severity_code JOIN incident_status st ON st.code=i.status_code;
COMMIT;
