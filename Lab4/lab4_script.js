// Лабораторна робота №4: Робота з документами в середовищі MongoDB
// Предметна область: Бібліотека (колекції books та authors)
// Студент групи ФеП-32 Чепара Станіслав

db = db.getSiblingDB("library_db");

// Перевірка наявності даних у колекціях books та authors
if (db.books.countDocuments() === 0 || db.authors.countDocuments() === 0) {
  console.log("Колекції порожні. Виконується наповнення даними з Lab 3...");
  const fs = require("fs");
  const authorsData = JSON.parse(fs.readFileSync("../Lab3/authors.json", "utf8"));
  const booksData = JSON.parse(fs.readFileSync("../Lab3/books.json", "utf8"));
  
  authorsData.forEach(a => { a._id = ObjectId(a._id.$oid); });
  booksData.forEach(b => {
    b._id = ObjectId(b._id.$oid);
    b.author_id = ObjectId(b.author_id.$oid);
  });
  
  db.authors.insertMany(authorsData);
  db.books.insertMany(booksData);
}

console.log("=== ЛАБОРАТОРНА РОБОТА №4 ===");
console.log("Поточна база даних:", db.getName());
console.log("Кількість книг:", db.books.countDocuments());
console.log("Кількість авторів:", db.authors.countDocuments());

// ==========================================
// 1. Параметризовані запити (Оператори: $gte, $lte, $in, $exists, $and, $or)
// ==========================================
console.log("\n--- 1. ПАРАМЕТРИЗОВАНІ ЗАПИТИ ---");

// 1.1. Книги, видані в діапазоні з 1900 до 1950 року ($gte, $lte)
console.log("\n1.1. Книги, видані між 1900 та 1950 роками ($gte, $lte):");
printjson(
  db.books.find(
    { year: { $gte: 1900, $lte: 1950 } },
    { title: 1, year: 1, _id: 0 }
  ).toArray()
);

// 1.2. Книги жанру 'поезія' або 'роман' ($in)
console.log("\n1.2. Книги, у яких серед жанрів є 'поезія' або 'роман' ($in):");
printjson(
  db.books.find(
    { genres: { $in: ["поезія", "роман"] } },
    { title: 1, genres: 1, _id: 0 }
  ).toArray()
);

// 1.3. Книги, що мають мітку раритету/антикваріату ($exists)
console.log("\n1.3. Книги, у яких існує поле 'antique' ($exists):");
printjson(
  db.books.find(
    { antique: { $exists: true } },
    { title: 1, year: 1, antique: 1, _id: 0 }
  ).toArray()
);

// 1.4. Книги, які є на складі та коштують менше 300 грн ($and, $lt)
console.log("\n1.4. Книги в наявності вартістю до 300 грн ($and, $lt):");
printjson(
  db.books.find(
    {
      $and: [
        { in_stock: true },
        { price: { $lt: 300 } }
      ]
    },
    { title: 1, price: 1, in_stock: 1, _id: 0 }
  ).toArray()
);

// 1.5. Автори, що народилися до 1850 року або після 1900 року ($or)
console.log("\n1.5. Автори, народжені до 1850 або після 1900 ($or):");
printjson(
  db.authors.find(
    {
      $or: [
        { birth_year: { $lt: 1850 } },
        { birth_year: { $gt: 1900 } }
      ]
    },
    { name: 1, birth_year: 1, _id: 0 }
  ).toArray()
);

// ==========================================
// 2. Проекції (Вибірка окремих полів)
// ==========================================
console.log("\n--- 2. ПРОЕКЦІЇ ---");

// 2.1. Вибірка назви книги, року та ціни без _id
console.log("\n2.1. Вибірка полів title, year, price (без _id):");
printjson(
  db.books.find(
    {},
    { title: 1, year: 1, price: 1, _id: 0 }
  ).limit(5).toArray()
);

// 2.2. Вибірка імені автора, жанрів та року народження для класиків
console.log("\n2.2. Вибірка полів name, genres, birth_year для класиків (без _id):");
printjson(
  db.authors.find(
    { is_classic: true },
    { name: 1, genres: 1, birth_year: 1, _id: 0 }
  ).limit(4).toArray()
);

// ==========================================
// 3. Управління вибіркою (limit, skip, findOne)
// ==========================================
console.log("\n--- 3. УПРАВЛІННЯ ВИБІРКОЮ ---");

// 3.1. Вибірка одного конкретного документа через findOne
console.log("\n3.1. Пошук одного документа книги 'Лісова пісня' (findOne):");
printjson(
  db.books.findOne(
    { title: "Лісова пісня" },
    { title: 1, year: 1, price: 1, "author.name": 1 }
  )
);

// 3.2. Посторінкова вибірка книг у наявності: пропуск 2, ліміт 3
console.log("\n3.2. Пропуск перших 2 документів та вибірка наступних 3 (skip, limit):");
printjson(
  db.books.find(
    { in_stock: true },
    { title: 1, price: 1, _id: 0 }
  ).skip(2).limit(3).toArray()
);

// ==========================================
// 4. Сортування даних (sort)
// ==========================================
console.log("\n--- 4. СОРТУВАННЯ ДАНИХ ---");

// 4.1. Просте сортування за одним полем: автори за роком народження (зростання)
console.log("\n4.1. Автори за роком народження за зростанням (sort: birth_year 1):");
printjson(
  db.authors.find(
    {},
    { name: 1, birth_year: 1, _id: 0 }
  ).sort({ birth_year: 1 }).limit(5).toArray()
);

// 4.2. Множинне сортування: книги за спаданням ціни, а при однаковій ціні - за роком видання
console.log("\n4.2. Множинне сортування книг: ціна за спаданням (-1), рік за зростанням (1):");
printjson(
  db.books.find(
    {},
    { title: 1, price: 1, year: 1, _id: 0 }
  ).sort({ price: -1, year: 1 }).limit(6).toArray()
);

// ==========================================
// 5. Агрегування (Aggregation Framework)
// ==========================================
console.log("\n--- 5. АГРЕГУВАННЯ ДАНИХ ---");

// 5.1. Групування книг за наявністю на складі з обчисленням суми, середнього, мін і макс ціни
console.log("\n5.1. Статистика цін книг за категорією наявності на складі ($group, $sum, $avg, $min, $max):");
printjson(
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
  ]).toArray()
);

// 5.2. Розгортання масиву жанрів авторів та підрахунок авторів за кожним жанром ($unwind, $group)
console.log("\n5.2. Розгортання масиву жанрів авторів та підрахунок ($unwind, $group):");
printjson(
  db.authors.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        authors_count: { $sum: 1 }
      }
    },
    { $sort: { authors_count: -1 } },
    { $limit: 5 }
  ]).toArray()
);

// 5.3. Складний конвеєр: фільтрація ($match), групування ($group) та сортування ($sort)
console.log("\n5.3. Складний конвеєр: фільтрація книг від 1850 року ($match), групування по автору ($group), сортування ($sort):");
printjson(
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
  ]).toArray()
);

// ==========================================
// 6. Підрахунок документів (countDocuments, estimatedDocumentCount)
// ==========================================
console.log("\n--- 6. ПІДРАХУНОК ДОКУМЕНТІВ ---");

const expensiveBooksCount = db.books.countDocuments({ price: { $gt: 250 } });
console.log("Точна кількість книг дорожчих за 250 грн (countDocuments):", expensiveBooksCount);

const poetryCount = db.books.countDocuments({ genres: "поезія" });
console.log("Точна кількість книг жанру 'поезія' (countDocuments):", poetryCount);

const estimatedBooks = db.books.estimatedDocumentCount();
console.log("Оціночна кількість усіх книг у колекції (estimatedDocumentCount):", estimatedBooks);

const estimatedAuthors = db.authors.estimatedDocumentCount();
console.log("Оціночна кількість усіх авторів у колекції (estimatedDocumentCount):", estimatedAuthors);

console.log("\n=== Виконання скрипта успішно завершено ===");
