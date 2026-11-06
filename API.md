# Документация Aegis REST API
Базовый URL: http://127.0.0.1:3029. JSON UTF-8. Query-параметры не используются. Список ресурсов возвращает SQL-поля location_name и incident_id, карточка и операции записи – DTO locationName. История назначений сохраняется. X-User-Id является учебной имитацией личности.

## UC1 Получить реестр происшествий

| Параметр | Описание |
|---|---|
| Метод и маршрут | GET /incidents |
| Успех | 200 |

Пример фактически выполненного запроса:
```http
GET /incidents HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
```
Пример ответа:
```http
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

[
  {
    "id": "d07bd806-a8cf-4d01-a820-2f40f058b85e",
    "number": "171",
    "title": "Учебная проверка бизнес-логики",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Подтвержден",
    "registered_at": "2026-11-06T11:27:30.204Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "81ab0cd7-a57e-4141-aa01-99da538eca2c",
    "number": "169",
    "title": "Учебная проверка бизнес-логики",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Завершен",
    "registered_at": "2026-11-06T11:27:29.953Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "c3f6a21a-026a-45e4-9877-48b6761650ab",
    "number": "168",
    "title": "поджег",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Завершен",
    "registered_at": "2026-10-21T16:36:37.037Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "711509a9-787b-44fc-93d4-0ecf54c7da71",
    "number": "167",
    "title": "Учебное задымление на объекте 123321",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Новый",
    "registered_at": "2026-10-21T16:31:29.840Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "6828aebc-7a7a-4023-af8d-1ca61040c88e",
    "number": "166",
    "title": "Учебное задымление на объекте",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Новый",
    "registered_at": "2026-10-21T16:31:20.698Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "61f48fbd-f4c8-4fc8-ad8f-293f8c184f19",
    "number": "165",
    "title": "Проверка запуска и инструкции",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Завершен",
    "registered_at": "2026-10-21T10:49:32.340Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "9092435d-ebdc-4e57-a7fb-1cbe4774fa6a",
    "number": "164",
    "title": "Проверка запуска и инструкции",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Новый",
    "registered_at": "2026-10-21T10:48:48.263Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "75051346-700d-4df3-9530-1dacd440fb15",
    "number": "163",
    "title": "Учебная проверка реагирования",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Завершен",
    "registered_at": "2026-10-21T10:42:21.623Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "2aa249d0-5dc2-43c5-bca4-f52dad1c40c9",
    "number": "162",
    "title": "Учебная проверка бизнес-логики",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Подтвержден",
    "registered_at": "2026-10-21T10:42:21.102Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "5ad228b4-23d0-4cc8-8664-0026070ec209",
    "number": "160",
    "title": "Учебная проверка бизнес-логики",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Завершен",
    "registered_at": "2026-10-21T10:42:21.056Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "d9ea31ec-c047-443c-a2a7-ea5454fb07ad",
    "number": "159",
    "title": "Учебная проверка бизнес-логики",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Подтвержден",
    "registered_at": "2026-10-21T10:24:39.060Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "ac641344-8d66-478a-a946-e27d7024dc7b",
    "number": "157",
    "title": "Учебная проверка бизнес-логики",
    "address": "Минск, учебный объект",
    "type": "Пожар",
    "severity": "Высокий",
    "priority": 2,
    "status": "Завершен",
    "registered_at": "2026-10-21T10:24:39.013Z",
    "lat": 53.91,
    "lng": 27.56,
    "active_resources": "0"
  },
  {
    "id": "30000000-0000-4000-8000-000000000003",
    "number": "156",
    "title": "Запах газа в подъезде",
    "address": "ул. Козлова, 15",
    "type": "Утечка газа",
    "severity": "Критический",
    "priority": 1,
    "status": "Новый",
    "registered_at": "2026-10-21T10:24:18.286Z",
    "lat": 53.909,
    "lng": 27.589,
    "active_resources": "0"
  },
  {
    "id": "30000000-0000-4000-8000-000000000002",
    "number": "155",
    "title": "Столкновение автомобилей",
    "address": "просп. Независимости, 72",
    "type": "ДТП",
    "severity": "Высокий",
    "priority": 2,
    "status": "Новый",
    "registered_at": "2026-10-21T10:24:18.286Z",
    "lat": 53.922,
    "lng": 27.611,
    "active_resources": "0"
  },
  {
    "id": "30000000-0000-4000-8000-000000000001",
    "number": "154",
    "title": "Пожар в жилом здании",
    "address": "ул. Якуба Коласа, 28",
    "type": "Пожар",
    "severity": "Критический",
    "priority": 1,
    "status": "Новый",
    "registered_at": "2026-10-21T10:24:18.279Z",
    "lat": 53.926,
    "lng": 27.599,
    "active_resources": "0"
  }
]
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| Отсутствуют | – | – | Тело, параметры пути и query не используются |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID происшествия |
| number | string | Номер bigint сериализуется строкой |
| title | string | Заголовок 1…120 |
| address | string | Адрес 1…200 |
| type | string | Поле представления incident_overview |
| severity | string | Поле представления incident_overview |
| priority | number | Приоритет критичности |
| status | string | Поле представления incident_overview |
| registered_at | string | Время регистрации ISO |
| lat | number | Широта PostGIS |
| lng | number | Долгота PostGIS |
| active_resources | string | Поле представления incident_overview |

| HTTP | Код | Описание |
|---|---|---|
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |

## UC2 Получить происшествие и историю

| Параметр | Описание |
|---|---|
| Метод и маршрут | GET /incidents/{id} |
| Успех | 200 |

Пример фактически выполненного запроса:
```http
GET /incidents/ab54d32a-1108-45cb-995b-114850ff5ce8 HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
```
Пример ответа:
```http
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

{
  "id": "ab54d32a-1108-45cb-995b-114850ff5ce8",
  "number": "172",
  "type_code": "FIRE",
  "severity_code": "HIGH",
  "status_code": "NEW",
  "reporter_id": "2ee97cc3-2f7e-433c-a839-a81cfaa537a1",
  "created_by": "00000000-0000-4000-8000-000000000001",
  "title": "HTTP проверка 1793965095760",
  "description": "Учебное сообщение для проверки API и транзакций.",
  "address": "Минск, учебная площадка",
  "location": "0101000020E61000008FC2F5285C8F3B4014AE47E17AF44A40",
  "occurred_at": "2026-11-06T11:37:15.972Z",
  "registered_at": "2026-11-06T11:38:15.982Z",
  "resolved_at": null,
  "lat": 53.91,
  "lng": 27.56,
  "history": [
    {
      "id": "64",
      "incident_id": "ab54d32a-1108-45cb-995b-114850ff5ce8",
      "actor_id": "00000000-0000-4000-8000-000000000001",
      "event_type": "CREATED",
      "from_status": null,
      "to_status": "NEW",
      "details": "Сообщение зарегистрировано",
      "occurred_at": "2026-11-06T11:38:15.991Z"
    }
  ],
  "assignments": []
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| id | string UUID | Да, path | Идентификатор объекта |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID происшествия |
| number | string | Номер bigint сериализуется строкой |
| type_code | string | Код типа |
| severity_code | string | Код критичности |
| status_code | string | Состояние жизненного цикла |
| reporter_id | string | UUID заявителя |
| created_by | string | UUID регистратора |
| title | string | Заголовок 1…120 |
| description | string | Описание 10…4000 |
| address | string | Адрес 1…200 |
| location | string | EWKB geography из PostgreSQL |
| occurred_at | string | Время происшествия ISO |
| registered_at | string | Время регистрации ISO |
| resolved_at | string / null | Время завершения либо null |
| lat | number | Широта PostGIS |
| lng | number | Долгота PostGIS |
| history | array | Массив событий audit_log; id, incident_id, actor_id, event_type, from_status, to_status, details, occurred_at |
| assignments | array | Массив назначений; id, incident_id, resource_id, assigned_by, assigned_at, released_at, name |

| HTTP | Код | Описание |
|---|---|---|
| 400 | INVALID_ID | Некорректный UUID |
| 404 | NOT_FOUND | Объект не найден |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |

## UC3 Зарегистрировать происшествие

| Параметр | Описание |
|---|---|
| Метод и маршрут | POST /incidents |
| Успех | 201 |

Пример фактически выполненного запроса:
```http
POST /incidents HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
X-User-Id: 00000000-0000-4000-8000-000000000001
Content-Type: application/json

{
  "typeCode": "FIRE",
  "severityCode": "HIGH",
  "title": "HTTP проверка 1793965095760",
  "description": "Учебное сообщение для проверки API и транзакций.",
  "address": "Минск, учебная площадка",
  "lat": 53.91,
  "lng": 27.56,
  "occurredAt": "2026-11-06T11:37:15.972Z",
  "reporterName": "Учебный заявитель",
  "phone": "+375000000099"
}
```
Пример ответа:
```http
HTTP/1.1 201
Content-Type: application/json; charset=utf-8

{
  "id": "ab54d32a-1108-45cb-995b-114850ff5ce8",
  "number": "172",
  "status_code": "NEW",
  "title": "HTTP проверка 1793965095760"
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| X-User-Id | string UUID | Да, header | ADMIN для изменения ресурса; ADMIN/DISPATCHER для происшествия. Отсутствие у старых операций происшествия: 400 INVALID_ID. |
| typeCode | string | Да, body | Код incident_type, например FIRE |
| severityCode | string | Да, body | Код severity, например HIGH |
| title | string | Да, body | Заголовок 1…120 |
| description | string | Да, body | Описание 10…4000 |
| address | string | Да, body | Адрес 1…200 |
| lat | number | Да, body | Широта от минус 90 до 90 |
| lng | number | Да, body | Долгота от минус 180 до 180 |
| occurredAt | string | Да, body | ISO-дата с часовым поясом, не в будущем |
| reporterName | string | Да, body | Имя заявителя 1…120 |
| phone | string | Да, body | Телефон 7…30, цифры, пробелы, +, скобки, дефис |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID происшествия |
| number | string | Номер bigint сериализуется строкой |
| status_code | string | Состояние жизненного цикла |
| title | string | Заголовок 1…120 |

| HTTP | Код | Описание |
|---|---|---|
| 403 | FORBIDDEN | Нет активного пользователя с требуемой ролью |
| 400 | INVALID_BODY / INVALID_FIELD | Неверные поля или JSON |
| 409 | 23503 / 23505 / 23514 | Нарушение ограничений БД |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |
| 400 | HTTP_ERROR | Поврежденное тело JSON |
| 400 | INVALID_ID / INVALID_DATE / INVALID_COORDINATES | Проверьте UUID автора, время и координаты |

## UC4 Изменить статус происшествия

| Параметр | Описание |
|---|---|
| Метод и маршрут | PATCH /incidents/{id}/status |
| Успех | 200 |

Пример фактически выполненного запроса:
```http
PATCH /incidents/ab54d32a-1108-45cb-995b-114850ff5ce8/status HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
X-User-Id: 00000000-0000-4000-8000-000000000001
Content-Type: application/json

{
  "status": "VERIFICATION"
}
```
Пример ответа:
```http
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

{
  "id": "ab54d32a-1108-45cb-995b-114850ff5ce8",
  "number": "172",
  "status_code": "VERIFICATION",
  "title": "HTTP проверка 1793965095760"
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| id | string UUID | Да, path | Идентификатор объекта |
| X-User-Id | string UUID | Да, header | ADMIN для изменения ресурса; ADMIN/DISPATCHER для происшествия. Отсутствие у старых операций происшествия: 400 INVALID_ID. |
| status | string | Да, body | Статус из графа переходов |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID происшествия |
| number | string | Номер bigint сериализуется строкой |
| status_code | string | Состояние жизненного цикла |
| title | string | Заголовок 1…120 |

| HTTP | Код | Описание |
|---|---|---|
| 403 | FORBIDDEN | Нет активного пользователя с требуемой ролью |
| 400 | INVALID_BODY / INVALID_FIELD | Неверные поля или JSON |
| 409 | 23503 / 23505 / 23514 | Нарушение ограничений БД |
| 400 | INVALID_ID | Некорректный UUID |
| 404 | NOT_FOUND | Объект не найден |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |
| 400 | HTTP_ERROR | Поврежденное тело JSON |
| 400 | INVALID_STATUS | Неизвестный статус |
| 409 | INVALID_TRANSITION / RESOURCE_REQUIRED | Переход запрещен или нет ресурса |

## UC5 Назначить ресурсы

| Параметр | Описание |
|---|---|
| Метод и маршрут | POST /incidents/{id}/assignments |
| Успех | 201 |

Пример фактически выполненного запроса:
```http
POST /incidents/ab54d32a-1108-45cb-995b-114850ff5ce8/assignments HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
X-User-Id: 00000000-0000-4000-8000-000000000001
Content-Type: application/json

{
  "resourceIds": [
    "0598bdf6-b240-414a-9a14-d055e69eeef5"
  ]
}
```
Пример ответа:
```http
HTTP/1.1 201
Content-Type: application/json; charset=utf-8

{
  "incidentId": "ab54d32a-1108-45cb-995b-114850ff5ce8",
  "assignmentIds": [
    "bd692293-c4cd-4e13-ba15-e8da80b3c958"
  ]
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| id | string UUID | Да, path | Идентификатор объекта |
| X-User-Id | string UUID | Да, header | ADMIN для изменения ресурса; ADMIN/DISPATCHER для происшествия. Отсутствие у старых операций происшествия: 400 INVALID_ID. |
| resourceIds | array | Да, body | От 1 до 8 уникальных UUID ресурсов |

| Поле ответа | Тип | Описание |
|---|---|---|
| incidentId | string | UUID происшествия |
| assignmentIds | array | UUID созданных назначений |

| HTTP | Код | Описание |
|---|---|---|
| 403 | FORBIDDEN | Нет активного пользователя с требуемой ролью |
| 400 | INVALID_BODY / INVALID_FIELD | Неверные поля или JSON |
| 409 | 23503 / 23505 / 23514 | Нарушение ограничений БД |
| 400 | INVALID_ID | Некорректный UUID |
| 404 | NOT_FOUND | Объект не найден |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |
| 400 | HTTP_ERROR | Поврежденное тело JSON |
| 400 | INVALID_RESOURCES | Размер массива либо повтор UUID |
| 404 | RESOURCE_NOT_FOUND | Один из ресурсов не найден |
| 409 | NOT_CONFIRMED / RESOURCE_BUSY / MAINTENANCE | Недопустимый статус или ресурс недоступен |

## UC6 Получить реестр ресурсов

| Параметр | Описание |
|---|---|
| Метод и маршрут | GET /resources |
| Успех | 200 |

Пример фактически выполненного запроса:
```http
GET /resources HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
```
Пример ответа:
```http
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

[
  {
    "id": "20000000-0000-4000-8000-000000000005",
    "name": "Автомобиль СА-11",
    "kind": "VEHICLE",
    "capacity": 4,
    "location_name": "Техническая база",
    "maintenance": true,
    "incident_id": null
  },
  {
    "id": "20000000-0000-4000-8000-000000000002",
    "name": "Бригада СМП № 04",
    "kind": "MEDICAL",
    "capacity": 3,
    "location_name": "Первомайский район",
    "maintenance": false,
    "incident_id": null
  },
  {
    "id": "20000000-0000-4000-8000-000000000004",
    "name": "Патруль № 21",
    "kind": "POLICE",
    "capacity": 2,
    "location_name": "Советский район",
    "maintenance": false,
    "incident_id": null
  },
  {
    "id": "20000000-0000-4000-8000-000000000001",
    "name": "Пожарный расчет № 12",
    "kind": "FIRE",
    "capacity": 6,
    "location_name": "Советский район",
    "maintenance": false,
    "incident_id": null
  },
  {
    "id": "20000000-0000-4000-8000-000000000003",
    "name": "Спасательная группа № 07",
    "kind": "RESCUE",
    "capacity": 5,
    "location_name": "Центральный район",
    "maintenance": false,
    "incident_id": null
  }
]
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| Отсутствуют | – | – | Тело, параметры пути и query не используются |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID ресурса |
| name | string | Наименование 1…120 символов |
| kind | string | FIRE, MEDICAL, RESCUE, POLICE, GAS, POWER или VEHICLE |
| capacity | number | Вместимость 1…100 |
| location_name | string | Место базирования |
| maintenance | boolean | На обслуживании |
| incident_id | string / null | UUID активного происшествия либо null |

| HTTP | Код | Описание |
|---|---|---|
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |

## UC7 Получить ресурс

| Параметр | Описание |
|---|---|
| Метод и маршрут | GET /resources/{id} |
| Успех | 200 |

Пример фактически выполненного запроса:
```http
GET /resources/7bb76b52-a9ff-40fe-ac69-dd9dcc21728b HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
```
Пример ответа:
```http
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

{
  "id": "7bb76b52-a9ff-40fe-ac69-dd9dcc21728b",
  "name": "Учебный ресурс 1793965095760",
  "kind": "RESCUE",
  "capacity": 5,
  "locationName": "Учебная база",
  "maintenance": false
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| id | string UUID | Да, path | Идентификатор объекта |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID ресурса |
| name | string | Наименование 1…120 символов |
| kind | string | FIRE, MEDICAL, RESCUE, POLICE, GAS, POWER или VEHICLE |
| capacity | number | Вместимость 1…100 |
| locationName | string | Место базирования 1…120 символов |
| maintenance | boolean | На обслуживании |

| HTTP | Код | Описание |
|---|---|---|
| 400 | INVALID_ID | Некорректный UUID |
| 404 | NOT_FOUND | Объект не найден |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |

## UC8 Добавить ресурс

| Параметр | Описание |
|---|---|
| Метод и маршрут | POST /resources |
| Успех | 201 |

Пример фактически выполненного запроса:
```http
POST /resources HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
X-User-Id: 00000000-0000-4000-8000-000000000002
Content-Type: application/json

{
  "name": "Учебный ресурс 1793965095760",
  "kind": "RESCUE",
  "capacity": 5,
  "locationName": "Учебная база",
  "maintenance": false
}
```
Пример ответа:
```http
HTTP/1.1 201
Content-Type: application/json; charset=utf-8

{
  "id": "7bb76b52-a9ff-40fe-ac69-dd9dcc21728b",
  "name": "Учебный ресурс 1793965095760",
  "kind": "RESCUE",
  "capacity": 5,
  "locationName": "Учебная база",
  "maintenance": false
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| X-User-Id | string UUID | Да, header | ADMIN для изменения ресурса; ADMIN/DISPATCHER для происшествия. Отсутствие у старых операций происшествия: 400 INVALID_ID. |
| name | string | Да, body | Наименование 1…120 символов |
| kind | string | Да, body | FIRE, MEDICAL, RESCUE, POLICE, GAS, POWER или VEHICLE |
| capacity | integer | Да, body | Вместимость 1…100 |
| locationName | string | Да, body | Место базирования 1…120 символов |
| maintenance | boolean | Да, body | На обслуживании |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID ресурса |
| name | string | Наименование 1…120 символов |
| kind | string | FIRE, MEDICAL, RESCUE, POLICE, GAS, POWER или VEHICLE |
| capacity | number | Вместимость 1…100 |
| locationName | string | Место базирования 1…120 символов |
| maintenance | boolean | На обслуживании |

| HTTP | Код | Описание |
|---|---|---|
| 401 | MISSING_ACTOR | Отсутствует X-User-Id |
| 403 | FORBIDDEN | Нет активного пользователя с требуемой ролью |
| 400 | INVALID_BODY / INVALID_FIELD | Неверные поля или JSON |
| 409 | 23503 / 23505 / 23514 | Нарушение ограничений БД |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |
| 400 | HTTP_ERROR | Поврежденное тело JSON |
| 400 | UNKNOWN_FIELD | Неизвестное поле DTO |

## UC9 Заменить сведения ресурса

| Параметр | Описание |
|---|---|
| Метод и маршрут | PUT /resources/{id} |
| Успех | 200 |

Пример фактически выполненного запроса:
```http
PUT /resources/7bb76b52-a9ff-40fe-ac69-dd9dcc21728b HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
X-User-Id: 00000000-0000-4000-8000-000000000002
Content-Type: application/json

{
  "name": "Учебный ресурс 1793965095760",
  "kind": "RESCUE",
  "capacity": 7,
  "locationName": "Учебная база",
  "maintenance": false
}
```
Пример ответа:
```http
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

{
  "id": "7bb76b52-a9ff-40fe-ac69-dd9dcc21728b",
  "name": "Учебный ресурс 1793965095760",
  "kind": "RESCUE",
  "capacity": 7,
  "locationName": "Учебная база",
  "maintenance": false
}
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| id | string UUID | Да, path | Идентификатор объекта |
| X-User-Id | string UUID | Да, header | ADMIN для изменения ресурса; ADMIN/DISPATCHER для происшествия. Отсутствие у старых операций происшествия: 400 INVALID_ID. |
| name | string | Да, body | Наименование 1…120 символов |
| kind | string | Да, body | FIRE, MEDICAL, RESCUE, POLICE, GAS, POWER или VEHICLE |
| capacity | integer | Да, body | Вместимость 1…100 |
| locationName | string | Да, body | Место базирования 1…120 символов |
| maintenance | boolean | Да, body | На обслуживании |

| Поле ответа | Тип | Описание |
|---|---|---|
| id | string | UUID ресурса |
| name | string | Наименование 1…120 символов |
| kind | string | FIRE, MEDICAL, RESCUE, POLICE, GAS, POWER или VEHICLE |
| capacity | number | Вместимость 1…100 |
| locationName | string | Место базирования 1…120 символов |
| maintenance | boolean | На обслуживании |

| HTTP | Код | Описание |
|---|---|---|
| 401 | MISSING_ACTOR | Отсутствует X-User-Id |
| 403 | FORBIDDEN | Нет активного пользователя с требуемой ролью |
| 400 | INVALID_BODY / INVALID_FIELD | Неверные поля или JSON |
| 409 | 23503 / 23505 / 23514 | Нарушение ограничений БД |
| 400 | INVALID_ID | Некорректный UUID |
| 404 | NOT_FOUND | Объект не найден |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |
| 400 | HTTP_ERROR | Поврежденное тело JSON |
| 400 | UNKNOWN_FIELD | Неизвестное поле DTO |
| 409 | RESOURCE_BUSY | Есть активное назначение |

## UC10 Удалить ресурс без истории

| Параметр | Описание |
|---|---|
| Метод и маршрут | DELETE /resources/{id} |
| Успех | 204 |

Пример фактически выполненного запроса:
```http
DELETE /resources/7bb76b52-a9ff-40fe-ac69-dd9dcc21728b HTTP/1.1
Host: 127.0.0.1:3029
Accept: application/json
X-User-Id: 00000000-0000-4000-8000-000000000002
```
Пример ответа:
```http
HTTP/1.1 204


(тело отсутствует)
```

| Параметр запроса | Тип | Обязательность | Описание |
|---|---|---|---|
| id | string UUID | Да, path | Идентификатор объекта |
| X-User-Id | string UUID | Да, header | ADMIN для изменения ресурса; ADMIN/DISPATCHER для происшествия. Отсутствие у старых операций происшествия: 400 INVALID_ID. |

| Поле ответа | Тип | Описание |
|---|---|---|
| Тело отсутствует | – | Ответ 204 не содержит JSON |

| HTTP | Код | Описание |
|---|---|---|
| 401 | MISSING_ACTOR | Отсутствует X-User-Id |
| 403 | FORBIDDEN | Нет активного пользователя с требуемой ролью |
| 400 | INVALID_ID | Некорректный UUID |
| 404 | NOT_FOUND | Объект не найден |
| 500 | INTERNAL_ERROR | Непредвиденная ошибка сервера |
| 409 | RESOURCE_REFERENCED | Есть история назначений |