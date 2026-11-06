\set ON_ERROR_STOP on
SET search_path=aegis,public;
BEGIN;
CREATE FUNCTION pg_temp.must_fail(statement text, expected text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE failed boolean := false;
BEGIN
 BEGIN EXECUTE statement;
 EXCEPTION WHEN OTHERS THEN
  IF SQLSTATE <> expected THEN RAISE EXCEPTION 'Expected %, got %: %',expected,SQLSTATE,SQLERRM; END IF;
  failed := true;
 END;
 IF NOT failed THEN RAISE EXCEPTION 'Statement unexpectedly succeeded: %',statement; END IF;
END $$;
SELECT pg_temp.must_fail($q$INSERT INTO resource(name,kind,capacity,location_name) VALUES('Отрицательная вместимость','FIRE',0,'База')$q$,'23514');
SELECT pg_temp.must_fail($q$INSERT INTO app_user(username,display_name,role) VALUES('dispatcher@aegis.demo','Дубль','ADMIN')$q$,'23505');
SELECT pg_temp.must_fail($q$INSERT INTO reporter(display_name,phone) VALUES('Заявитель','invalid')$q$,'23514');
SELECT pg_temp.must_fail($q$INSERT INTO resource(name,kind,capacity,location_name) VALUES(NULL,'FIRE',2,'База')$q$,'23502');
SELECT pg_temp.must_fail($q$UPDATE incident SET status_code='RESPONDING' WHERE id='30000000-0000-4000-8000-000000000001'$q$,'23514');
SELECT pg_temp.must_fail($q$UPDATE incident SET reporter_id='99999999-9999-4999-8999-999999999999' WHERE id='30000000-0000-4000-8000-000000000001'$q$,'23503');
SELECT pg_temp.must_fail($q$UPDATE audit_log SET details='Исправление' WHERE id=(SELECT min(id) FROM audit_log)$q$,'23514');
SELECT pg_temp.must_fail($q$DELETE FROM audit_log WHERE id=(SELECT min(id) FROM audit_log)$q$,'23514');
\echo 'PASS: 8 negative SQL checks; expected SQLSTATE verified'
ROLLBACK;
