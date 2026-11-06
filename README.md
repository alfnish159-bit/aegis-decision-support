# Aegis REST API

Публичный репозиторий: https://github.com/alfnish159-bit/aegis-decision-support

Учебная система учета происшествий и назначения ресурсов. TypeScript, NestJS 10, PostgreSQL 16/PostGIS 3.4, node-postgres. src/ расширяет shared/ – проверенные классы ЛР8. Это автономный снимок единой реализации из ЛР8/src и ЛР9/src. Миграция database/01-schema.sql сохраняет модель ЛР7.

## Запуск

Требуются Node.js 22 или новее, npm и Docker Compose. Скопируйте .env.example в .env. Задайте собственный POSTGRES_PASSWORD и DATABASE_URL вида postgresql://aegis:YOUR_PASSWORD@127.0.0.1:5549/aegis_labs. Файл .env исключен из Git.

```bash
git clone https://github.com/alfnish159-bit/aegis-decision-support.git
cd aegis-decision-support
npm ci
docker compose up -d --wait db
docker compose exec -T db psql -U aegis -d aegis_labs -v ON_ERROR_STOP=1 < database/01-schema.sql
docker compose exec -T db psql -U aegis -d aegis_labs -v ON_ERROR_STOP=1 < database/02-seed.sql
npm run build
node --env-file=.env dist/src/main.js
```

DDL и seed применяются один раз к новой БД. Повторно создавать заполненную схему не нужно. Команды не удаляют существующие volume. Можно использовать существующую БД ЛР7 через DATABASE_URL без нового контейнера.

Откройте http://127.0.0.1:3029/docs и /openapi.json. Спецификация импортируется в Postman и Swagger Editor. Учебная консоль: /. API.md содержит таблицы всех 10 операций.

```bash
export DATABASE_URL='postgresql://aegis:YOUR_PASSWORD@127.0.0.1:5549/aegis_labs'
npm test
```

Тесты используют настоящий PostgreSQL/PostGIS, создают учебные происшествия и сохраняют историю. Для изолированного запуска рекомендуется отдельная учебная БД.

## Учебная идентификация

X-User-Id: диспетчер 00000000-0000-4000-8000-000000000001, администратор 00000000-0000-4000-8000-000000000002. Это публичные ID демонстрационных записей. Запись каталога требует ADMIN. Полноценной аутентификации нет. Сервер слушает loopback; для внешнего развертывания нужны отдельные аутентификация и TLS.

GET /incidents; GET /incidents/{id}; POST /incidents; PATCH /incidents/{id}/status; POST /incidents/{id}/assignments. GET /resources; GET /resources/{id}; POST /resources; PUT /resources/{id}; DELETE /resources/{id}. Ресурс с историей назначений не удаляется (409); занятый ресурс не изменяется (409). Успешное удаление: 204.

HTTP-слой проверяет DTO, сервисы – правила и транзакции, репозитории – SQL, Incident – переходы состояний. ResourceCatalog внедряется через useExisting: PgResourceCatalog. Database и ApiErrorFilter переиспользованы из ЛР8.

Сторонние компоненты: NestJS: https://docs.nestjs.com/ ; node-postgres: https://node-postgres.com/ ; PostGIS: https://postgis.net/documentation/ ; TypeScript: https://www.typescriptlang.org/docs/ .


## Интерфейс журнала и каталога

Откройте `http://127.0.0.1:3029/`. Разделы «Журнал происшествий» и «Ресурсы» переключаются в верхней панели; выбор учебной роли находится справа. Список имеет поиск, фильтры и пагинацию. Карточки и формы открываются в боковой панели; Escape закрывает ее и возвращает фокус. История решений отображается хронологией, исходный JSON остается доступен в раскрывающемся блоке.

Для изменения каталога выберите «Администратор». Интерфейс поддерживает создание, полное редактирование и удаление ресурса; удаление требует отдельного подтверждения и ограничено серверными правилами. В журнале сначала подтвердите сообщение и назначьте ресурс, затем начинайте реагирование.

Дизайн адаптируется к узким экранам: таблица превращается в компактный список с видимыми приоритетом и состоянием. Настройка ОС `prefers-reduced-motion` отключает перемещения и задержки анимаций.

Исходники интерфейса находятся в `ui/`: разметка, стили, JavaScript и локальный шрифт Golos Text под SIL OFL. После правок выполните `npm run build:ui`. Генератор создает самостоятельные HTML в `public/`, поэтому для показа не нужны внешние шрифтовые сервисы или CDN. Перезапуск NestJS при изменении HTML не требуется.
