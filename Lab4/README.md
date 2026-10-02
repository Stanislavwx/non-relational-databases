# Лабораторна робота №4

**Тема:** Робота з документами в середовищі MongoDB  
**Мета:** Створення та практичне дослідження запитів вибірки, фільтрації, проекції, сортування, конвеєрів агрегації та методів підрахунку документів у консолі mongosh та графічному інтерфейсі MongoDB Compass.

## Предметна область

Для виконання роботи використано базу даних **`library_db`** («Бібліотека») та колекції, спроєктовані у лабораторній роботі №3:
- **`books`** - документи літературних творів (назва, рік видання, жанри, кількість сторінок, ціна, наявність у фонді, вкладений документ автора, посилання `author_id`, мітка раритетності `antique`);
- **`authors`** - документи письменників (ім'я, країна, рік народження, жанри, статус класика).

## Структура файлів

```
Lab4/
├── lab4_script.js       # повний набір команд і запитів для консолі mongosh
├── Lab4_report.docx     # звіт про виконання лабораторної роботи
├── Lab4_report.pdf      # скомпільований PDF-варіант звіту
└── README.md            # документація до роботи
```

## Реалізовані запити

### 1. Параметризовані запити
- **Діапазон років ($gte, $lte):** пошук книг, виданих між 1900 та 1950 роками.
  ```javascript
  db.books.find({ year: { $gte: 1900, $lte: 1950 } }, { title: 1, year: 1, _id: 0 })
  ```
- **Входження до списку ($in):** вибірка книг, що належать до жанру «поезія» або «роман».
  ```javascript
  db.books.find({ genres: { $in: ["поезія", "роман"] } }, { title: 1, genres: 1, _id: 0 })
  ```
- **Наявність поля ($exists):** вибірка книг, у яких присутнє поле `antique`.
  ```javascript
  db.books.find({ antique: { $exists: true } }, { title: 1, year: 1, antique: 1, _id: 0 })
  ```
- **Логічні умови ($and, $lt):** книги в наявності вартістю менше 300 грн.
  ```javascript
  db.books.find({ $and: [ { in_stock: true }, { price: { $lt: 300 } } ] }, { title: 1, price: 1, in_stock: 1, _id: 0 })
  ```
- **Логічні умови ($or):** автори, народжені до 1850 року або після 1900 року.
  ```javascript
  db.authors.find({ $or: [ { birth_year: { $lt: 1850 } }, { birth_year: { $gt: 1900 } } ] }, { name: 1, birth_year: 1, _id: 0 })
  ```

### 2. Проекції (вибірка окремих полів)
- Вибірка лише полів `title`, `year`, `price` з вимкненням `_id`:
  ```javascript
  db.books.find({}, { title: 1, year: 1, price: 1, _id: 0 }).limit(5)
  ```
- Вибірка імені, жанрів та року народження авторів зі статусом класика:
  ```javascript
  db.authors.find({ is_classic: true }, { name: 1, genres: 1, birth_year: 1, _id: 0 }).limit(4)
  ```

### 3. Управління вибіркою (limit, skip, findOne)
- Отримання одного документа конкретної книги без повернення курсора:
  ```javascript
  db.books.findOne({ title: "Лісова пісня" }, { title: 1, year: 1, price: 1, "author.name": 1 })
  ```
- Пагінація: пропуск перших 2 документів та вибірка наступних 3:
  ```javascript
  db.books.find({ in_stock: true }, { title: 1, price: 1, _id: 0 }).skip(2).limit(3)
  ```

### 4. Сортування даних (sort)
- Просте сортування авторів за роком народження від найстаршого (зростання):
  ```javascript
  db.authors.find({}, { name: 1, birth_year: 1, _id: 0 }).sort({ birth_year: 1 }).limit(5)
  ```
- Складене сортування книг: за спаданням ціни (-1), а за однакової ціни - за зростанням року видання (1):
  ```javascript
  db.books.find({}, { title: 1, price: 1, year: 1, _id: 0 }).sort({ price: -1, year: 1 }).limit(6)
  ```

### 5. Агрегування даних (Aggregation Pipeline)
- Групування книг за наявністю на складі з обчисленням кількості, середньої, мінімальної та максимальної ціни ($group, $sum, $avg, $min, $max):
  ```javascript
  db.books.aggregate([
    {
      $group: {
        _id: "$in_stock",
        total_books: { $sum: 1 },
        avg_price: { $avg: "$price" },
        min_price: { $min: "$price" },
        max_price: { $max: "$price" }
      }
    }
  ])
  ```
- Розгортання масиву жанрів ($unwind) з підрахунком популярності кожного жанру:
  ```javascript
  db.authors.aggregate([
    { $unwind: "$genres" },
    { $group: { _id: "$genres", authors_count: { $sum: 1 } } },
    { $sort: { authors_count: -1 } },
    { $limit: 5 }
  ])
  ```
- Багатостадійний конвеєр ($match -> $group -> $sort): відбір книг від 1850 року, групування по імені автора, розрахунок сумарної вартості книг і середньої кількості сторінок із сортуванням за загальною вартістю:
  ```javascript
  db.books.aggregate([
    { $match: { year: { $gte: 1850 } } },
    {
      $group: {
        _id: "$author.name",
        books_count: { $sum: 1 },
        total_cost: { $sum: "$price" },
        avg_pages: { $avg: "$pages" }
      }
    },
    { $sort: { total_cost: -1 } }
  ])
  ```

### 6. Підрахунок документів
- Точний підрахунок за критерієм:
  ```javascript
  db.books.countDocuments({ price: { $gt: 250 } })
  ```
- Швидка оцінка кількості на основі метаданих:
  ```javascript
  db.books.estimatedDocumentCount()
  ```

### 7. Робота у графічному інтерфейсі MongoDB Compass
У інтерфейсі Compass на вкладці колекції `books` застосовано налаштування:
- **Filter:** `{ year: { $gte: 1900 }, in_stock: true }`
- **Project:** `{ title: 1, year: 1, price: 1, _id: 0 }`
- **Sort:** `{ price: -1 }`

## Інструкція із запуску

1. Підключитися до бази даних в інтерактивному режимі:
   ```bash
   mongosh library_db
   ```
2. Виконати всі запити одним файлом:
   ```bash
   mongosh library_db lab4_script.js
   ```
