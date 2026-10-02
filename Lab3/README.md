# Лабораторна робота №3

**Тема:** Створення та моделювання баз даних в MongoDB  
**Мета:** Ознайомлення з роботою MongoDB у консолі mongosh, отримання навичок створення бази даних, колекцій і документів, їх вилучення та перейменування, а також практичне опанування моделювання зв'язків між документами (Embedded Documents, References, $lookup).

## Предметна область

Обрана предметна область: **«Бібліотека»** (каталог книг та авторів).

Спроєктовано дві колекції в базі даних `library_db`:
- `authors` - інформація про письменників (ПІБ, країна, рік народження, жанри, статус класика);
- `books` - інформація про літературні твори (назва, рік видання, жанри, кількість сторінок, вартість, наявність у фонді, вкладений документ автора, посилання `author_id`).

## Структура файлів

```
Lab3/
├── lab3_script.js           # команди та запити для консолі MongoDB Shell (mongosh)
├── books.json               # 10 документів колекції books
├── authors.json             # 10 документів колекції authors
├── Lab3_report.docx         # звіт про виконання лабораторної роботи
├── Lab3_report.pdf          # згенерований PDF-варіант звіту
├── generate_lab3_report.py  # генератор файлу звіту docx
└── README.md                # документація до роботи
```

## Опис структури даних

### Колекція `authors`

| Поле | Тип BSON | Опис |
|------|----------|------|
| `_id` | ObjectId | Унікальний первинний ідентифікатор автора |
| `name` | String | Ім'я та прізвище письменника |
| `country` | String | Країна походження |
| `birth_year` | Int32 | Рік народження |
| `genres` | Array of Strings | Основні літературні жанри |
| `is_classic` | Boolean | Ознака класика літератури |

### Колекція `books`

| Поле | Тип BSON | Опис |
|------|----------|------|
| `_id` | ObjectId | Унікальний ідентифікатор книги |
| `title` | String | Назва твору |
| `year` | Int32 | Рік першого видання |
| `genres` | Array of Strings | Жанри книги |
| `pages` | Int32 | Кількість сторінок |
| `price` | Double | Вартість примірника у гривнях |
| `in_stock` | Boolean | Наявність на складі бібліотеки |
| `author` | Embedded Document | Вкладений документ автора (`name`, `country`, `birth_year`) |
| `author_id` | ObjectId (Reference) | Посилання на `_id` відповідного автора з колекції `authors` |

## Робота з базою даних у mongosh

Для підключення до СКБД та виконання команд у консолі:

```bash
mongosh library_db
```

Також підготовлено файли даних для імпорту через утиліту `mongoimport`:

```bash
mongoimport --db library_db --collection authors --jsonArray --file authors.json
mongoimport --db library_db --collection books --jsonArray --file books.json
```

## Моделювання зв'язків та приклади запитів

### 1. Вкладені документи (Embedded Documents)
Дані про автора дублюються всередині документа книги для швидкого читання без додаткових звернень:
```javascript
// Пошук книг конкретного автора за вкладеним полем
db.books.find({ "author.name": "Тарас Шевченко" }, { title: 1, year: 1, _id: 0 })

// Пошук творів авторів, народжених до 1860 року
db.books.find({ "author.birth_year": { $lt: 1860 } }, { title: 1, "author.name": 1, _id: 0 })
```

### 2. Посилання (References через ObjectId)
У книзі зберігається лише ідентифікатор автора `author_id`, що забезпечує нормалізацію даних:
```javascript
// Пошук книг за ObjectId конкретного автора
db.books.find({ author_id: ObjectId("650000000000000000000002") }, { title: 1, year: 1, _id: 0 })

// Підрахунок книг одного автора
db.books.countDocuments({ author_id: ObjectId("650000000000000000000001") })
```

### 3. Агрегація-з'єднання ($lookup)
Динамічне об'єднання двох колекцій на стороні сервера:
```javascript
// З'єднання книг з повною інформацією про автора
db.books.aggregate([
  { $match: { title: "Кобзар" } },
  { $lookup: { from: "authors", localField: "author_id", foreignField: "_id", as: "author_details" } },
  { $unwind: "$author_details" },
  { $project: { title: 1, year: 1, price: 1, "author_details.name": 1, "author_details.country": 1 } }
])
```

## Керування колекціями
- Створення обмеженої (capped) колекції:
  ```javascript
  db.createCollection("activity_logs", { capped: true, size: 1048576, max: 50 })
  ```
- Перевірка обмеженої колекції:
  ```javascript
  db.activity_logs.isCapped()
  ```
- Перейменування та видалення:
  ```javascript
  db.old_name.renameCollection("new_name")
  db.new_name.drop()
  ```
