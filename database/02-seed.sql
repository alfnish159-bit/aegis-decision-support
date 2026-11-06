\set ON_ERROR_STOP on
BEGIN;
SET search_path=aegis,public;
INSERT INTO app_user(id,username,display_name,role) VALUES
('00000000-0000-4000-8000-000000000001','dispatcher@aegis.demo','Учебный диспетчер','DISPATCHER'),
('00000000-0000-4000-8000-000000000002','admin@aegis.demo','Администратор учебной системы','ADMIN');
INSERT INTO incident_type VALUES ('FIRE','Пожар'),('TRAFFIC','ДТП'),('FLOOD','Подтопление'),('GAS','Утечка газа'),('POWER','Авария электроснабжения'),('DANGER','Опасный объект');
INSERT INTO severity VALUES ('CRITICAL','Критический',1),('HIGH','Высокий',2),('MEDIUM','Средний',3),('LOW','Низкий',4);
INSERT INTO incident_status VALUES ('NEW','Новый',false),('VERIFICATION','Проверка',false),('CONFIRMED','Подтвержден',false),('RESPONDING','Реагирование',false),('LOCALIZED','Локализован',false),('RESOLVED','Завершен',true);
INSERT INTO reporter(id,display_name,phone) VALUES
('10000000-0000-4000-8000-000000000001','Учебный заявитель А','+375 (00) 000-00-01'),
('10000000-0000-4000-8000-000000000002','Учебный заявитель Б','+375 (00) 000-00-02');
INSERT INTO resource(id,name,kind,capacity,location_name,maintenance) VALUES
('20000000-0000-4000-8000-000000000001','Пожарный расчет № 12','FIRE',6,'Советский район',false),
('20000000-0000-4000-8000-000000000002','Бригада СМП № 04','MEDICAL',3,'Первомайский район',false),
('20000000-0000-4000-8000-000000000003','Спасательная группа № 07','RESCUE',5,'Центральный район',false),
('20000000-0000-4000-8000-000000000004','Патруль № 21','POLICE',2,'Советский район',false),
('20000000-0000-4000-8000-000000000005','Автомобиль СА-11','VEHICLE',4,'Техническая база',true);
INSERT INTO incident(id,type_code,severity_code,reporter_id,created_by,title,description,address,location,occurred_at) VALUES
('30000000-0000-4000-8000-000000000001','FIRE','CRITICAL','10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Пожар в жилом здании','Задымление на третьем этаже. Требуется помощь при эвакуации. Учебные сведения.','ул. Якуба Коласа, 28',ST_SetSRID(ST_MakePoint(27.599,53.926),4326)::geography,'2026-10-20 08:30+03'),
('30000000-0000-4000-8000-000000000002','TRAFFIC','HIGH','10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Столкновение автомобилей','Столкновение двух автомобилей у перекрестка. Данные демонстрационные.','просп. Независимости, 72',ST_SetSRID(ST_MakePoint(27.611,53.922),4326)::geography,'2026-10-20 08:45+03'),
('30000000-0000-4000-8000-000000000003','GAS','CRITICAL','10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001','Запах газа в подъезде','Получено учебное сообщение о запахе газа в подъезде жилого дома.','ул. Козлова, 15',ST_SetSRID(ST_MakePoint(27.589,53.909),4326)::geography,'2026-10-20 09:00+03');
INSERT INTO audit_log(incident_id,actor_id,event_type,to_status,details)
 SELECT id,created_by,'CREATED','NEW','Регистрация учебного сообщения' FROM incident;
COMMIT;
