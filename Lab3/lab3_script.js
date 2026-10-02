// Лабораторна робота №3: Створення та моделювання баз даних в MongoDB
// Предметна область: Бібліотека (колекції books та authors)
// Автор: студент групи ФеП-32 Чепара Станіслав

// ==========================================
// 1. Створення та видалення тестової БД
// ==========================================
let tempDb = db.getSiblingDB("test_temp_db");
tempDb.temp_collection.insertOne({ demo: "data", createdAt: new Date() });
console.log("--- 1. Створення тестової БД ---");
console.log("Бази на сервері:", db.adminCommand({ listDatabases: 1 }).databases.map(d => d.name));

console.log("--- Видалення тестової БД ---");
console.log(tempDb.dropDatabase());

// ==========================================
// 2. Робота з основною БД: library_db
// ==========================================
db = db.getSiblingDB("library_db");

// Очищення перед початком
db.books.drop();
db.authors.drop();
db.activity_logs.drop();
db.old_name_coll.drop();
db.renamed_coll.drop();

// ==========================================
// 3. Керування колекціями (capped, перейменування, видалення)
// ==========================================
console.log("\n--- 2. Робота з колекціями ---");
// Створення обмеженої (capped) колекції для системного журналу
db.createCollection("activity_logs", { capped: true, size: 1048576, max: 50 });
console.log("Чи є activity_logs обмеженою (isCapped):", db.activity_logs.isCapped());

// Демонстрація перейменування та видалення колекції
db.createCollection("old_name_coll");
db.old_name_coll.insertOne({ status: "ready" });
db.old_name_coll.renameCollection("renamed_coll");
console.log("Колекції після renameCollection:", db.getCollectionNames());
db.renamed_coll.drop();
console.log("Колекції після drop:", db.getCollectionNames());

// ==========================================
// 4. Створення та наповнення колекції авторів (authors)
// 10 документів, 5+ полів різних типів
// ==========================================
const authorIds = [
  new ObjectId("650000000000000000000001"),
  new ObjectId("650000000000000000000002"),
  new ObjectId("650000000000000000000003"),
  new ObjectId("650000000000000000000004"),
  new ObjectId("650000000000000000000005"),
  new ObjectId("650000000000000000000006"),
  new ObjectId("650000000000000000000007"),
  new ObjectId("650000000000000000000008"),
  new ObjectId("650000000000000000000009"),
  new ObjectId("650000000000000000000010")
];

db.authors.insertMany([
  {
    _id: authorIds[0],
    name: "Тарас Шевченко",
    country: "Україна",
    birth_year: 1814,
    genres: ["поезія", "драма"],
    is_classic: true
  },
  {
    _id: authorIds[1],
    name: "Іван Франко",
    country: "Україна",
    birth_year: 1856,
    genres: ["поезія", "проза", "драма"],
    is_classic: true
  },
  {
    _id: authorIds[2],
    name: "Леся Українка",
    country: "Україна",
    birth_year: 1871,
    genres: ["поезія", "драма"],
    is_classic: true
  },
  {
    _id: authorIds[3],
    name: "Михайло Коцюбинський",
    country: "Україна",
    birth_year: 1864,
    genres: ["новела", "повість"],
    is_classic: true
  },
  {
    _id: authorIds[4],
    name: "Валер'ян Підмогильний",
    country: "Україна",
    birth_year: 1901,
    genres: ["роман", "модернізм"],
    is_classic: true
  },
  {
    _id: authorIds[5],
    name: "Іван Багряний",
    country: "Україна",
    birth_year: 1906,
    genres: ["роман", "пригоди"],
    is_classic: true
  },
  {
    _id: authorIds[6],
    name: "Ольга Кобилянська",
    country: "Україна",
    birth_year: 1863,
    genres: ["повість", "новела"],
    is_classic: true
  },
  {
    _id: authorIds[7],
    name: "Панас Мирний",
    country: "Україна",
    birth_year: 1849,
    genres: ["роман", "повість"],
    is_classic: true
  },
  {
    _id: authorIds[8],
    name: "Василь Стус",
    country: "Україна",
    birth_year: 1938,
    genres: ["поезія", "есеїстика"],
    is_classic: true
  },
  {
    _id: authorIds[9],
    name: "Ліна Костенко",
    country: "Україна",
    birth_year: 1930,
    genres: ["поезія", "роман у віршах"],
    is_classic: true
  }
]);

// ==========================================
// 5. Створення та наповнення колекції книг (books)
// 10 документів, різні типи полів:
// string, number, boolean, array, embedded document, ObjectId (references)
// ==========================================
db.books.insertMany([
  {
    title: "Кобзар",
    year: 1840,
    genres: ["поезія", "класика"],
    pages: 115,
    price: 320.0,
    in_stock: true,
    author: {
      name: "Тарас Шевченко",
      country: "Україна",
      birth_year: 1814
    },
    author_id: authorIds[0]
  },
  {
    title: "Гайдамаки",
    year: 1841,
    genres: ["поезія", "історична поема"],
    pages: 140,
    price: 210.0,
    in_stock: true,
    author: {
      name: "Тарас Шевченко",
      country: "Україна",
      birth_year: 1814
    },
    author_id: authorIds[0]
  },
  {
    title: "Захар Беркут",
    year: 1883,
    genres: ["історична повість", "класика"],
    pages: 240,
    price: 280.0,
    in_stock: true,
    author: {
      name: "Іван Франко",
      country: "Україна",
      birth_year: 1856
    },
    author_id: authorIds[1]
  },
  {
    title: "Борислав сміється",
    year: 1881,
    genres: ["роман", "соціальна проза"],
    pages: 310,
    price: 295.0,
    in_stock: false,
    author: {
      name: "Іван Франко",
      country: "Україна",
      birth_year: 1856
    },
    author_id: authorIds[1]
  },
  {
    title: "Лісова пісня",
    year: 1911,
    genres: ["драма-феєрія", "фольклор"],
    pages: 160,
    price: 240.0,
    in_stock: true,
    author: {
      name: "Леся Українка",
      country: "Україна",
      birth_year: 1871
    },
    author_id: authorIds[2]
  },
  {
    title: "Тіні забутих предків",
    year: 1911,
    genres: ["повість", "фольклор"],
    pages: 180,
    price: 260.0,
    in_stock: true,
    author: {
      name: "Михайло Коцюбинський",
      country: "Україна",
      birth_year: 1864
    },
    author_id: authorIds[3]
  },
  {
    title: "Місто",
    year: 1928,
    genres: ["роман", "модернізм", "урбаністика"],
    pages: 300,
    price: 350.0,
    in_stock: true,
    author: {
      name: "Валер'ян Підмогильний",
      country: "Україна",
      birth_year: 1901
    },
    author_id: authorIds[4]
  },
  {
    title: "Тигролови",
    year: 1944,
    genres: ["пригодницький роман", "класика"],
    pages: 320,
    price: 330.0,
    in_stock: true,
    author: {
      name: "Іван Багряний",
      country: "Україна",
      birth_year: 1906
    },
    author_id: authorIds[5]
  },
  {
    title: "Земля",
    year: 1902,
    genres: ["соціально-психологічна повість"],
    pages: 340,
    price: 275.0,
    in_stock: false,
    author: {
      name: "Ольга Кобилянська",
      country: "Україна",
      birth_year: 1863
    },
    author_id: authorIds[6]
  },
  {
    title: "Маруся Чурай",
    year: 1979,
    genres: ["історичний роман у віршах", "поезія"],
    pages: 220,
    price: 390.0,
    in_stock: true,
    author: {
      name: "Ліна Костенко",
      country: "Україна",
      birth_year: 1930
    },
    author_id: authorIds[9]
  }
]);

console.log("\n--- 3. Дані успішно заповнено ---");
console.log("Кількість авторів:", db.authors.countDocuments());
console.log("Кількість книг:", db.books.countDocuments());

// ==========================================
// 6. Моделювання зв'язків: Embedded Documents (3 запити)
// ==========================================
console.log("\n--- 4.1. Embedded Documents запити ---");

// Запит 1: Пошук за ім'ям автора у вкладеному документі
console.log("1) Книги автора Тарас Шевченко (за вкладеним документом):");
console.log(db.books.find({ "author.name": "Тарас Шевченко" }, { title: 1, year: 1, _id: 0 }).toArray());

// Запит 2: Пошук за роком народження автора у вкладеному документі ($lt)
console.log("\n2) Книги авторів, народжених до 1860 року:");
console.log(db.books.find({ "author.birth_year": { $lt: 1860 } }, { title: 1, "author.name": 1, "author.birth_year": 1, _id: 0 }).toArray());

// Запит 3: Фільтрація за країною автора та наявністю на складі
console.log("\n3) Наявні книги українських авторів (вибірка полів):");
console.log(db.books.find({ "author.country": "Україна", in_stock: true }, { title: 1, price: 1, "author.name": 1, _id: 0 }).limit(3).toArray());

// ==========================================
// 7. Моделювання зв'язків: References через ObjectId (3 запити)
// ==========================================
console.log("\n--- 4.2. References запити ---");

// Запит 1: Пошук книг за ObjectId конкретного автора (Іван Франко)
console.log("1) Книги за author_id Франка:");
console.log(db.books.find({ author_id: authorIds[1] }, { title: 1, year: 1, _id: 0 }).toArray());

// Запит 2: Пошук книг кількох авторів за масивом ідентифікаторів ($in)
console.log("\n2) Книги за списком author_id (Шевченко, Українка):");
console.log(db.books.find({ author_id: { $in: [authorIds[0], authorIds[2]] } }, { title: 1, author_id: 1, _id: 0 }).toArray());

// Запит 3: Кількість книг автора за його ObjectId
console.log("\n3) Кількість книг у базі для автора з authorIds[0]:", db.books.countDocuments({ author_id: authorIds[0] }));

// ==========================================
// 8. Моделювання зв'язків: $lookup агрегація (3 запити)
// ==========================================
console.log("\n--- 4.3. $lookup агрегація ---");

// Запит 1: З'єднання книг з авторами за спільним ключем author_id -> _id
console.log("1) $lookup: книги з повною інформацією про автора:");
console.log(JSON.stringify(db.books.aggregate([
  { $match: { title: "Кобзар" } },
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  { $unwind: "$author_details" },
  {
    $project: {
      title: 1,
      year: 1,
      price: 1,
      "author_details.name": 1,
      "author_details.country": 1
    }
  }
]).toArray(), null, 2));

// Запит 2: $lookup з фільтрацією за роком та сортуванням
console.log("\n2) $lookup: книги після 1900 року, відсортовані за роком:");
console.log(JSON.stringify(db.books.aggregate([
  { $match: { year: { $gte: 1900 } } },
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_info"
    }
  },
  { $unwind: "$author_info" },
  { $sort: { year: 1 } },
  {
    $project: {
      title: 1,
      year: 1,
      author_name: "$author_info.name",
      genres: 1,
      _id: 0
    }
  },
  { $limit: 3 }
]).toArray(), null, 2));

// Запит 3: Зворотний $lookup: автори та кількість їхніх книг
console.log("\n3) Зворотний $lookup: автори зі списком їхніх книг:");
console.log(JSON.stringify(db.authors.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "author_id",
      as: "written_books"
    }
  },
  {
    $project: {
      name: 1,
      books_count: { $size: "$written_books" },
      book_titles: "$written_books.title",
      _id: 0
    }
  },
  { $limit: 4 }
]).toArray(), null, 2));

// ==========================================
// 9. Операції оновлення та видалення документів (CRUD)
// ==========================================
console.log("\n--- 5. Оновлення та видалення документів ---");

// updateOne: оновлення ціни однієї книги
db.books.updateOne(
  { title: "Кобзар" },
  { $set: { price: 350.0, updated_at: new Date() } }
);
console.log("Оновлена ціна книги Кобзар:", db.books.findOne({ title: "Кобзар" }, { title: 1, price: 1, _id: 0 }));

// updateMany: оновлення статусу наявності для старих видань
db.books.updateMany(
  { year: { $lt: 1900 } },
  { $set: { antique: true } }
);
console.log("Кількість раритетних книг (antique=true):", db.books.countDocuments({ antique: true }));

// replaceOne: повна заміна одного тестового документа
db.activity_logs.insertOne({ action: "initial_log", user: "system" });
db.activity_logs.replaceOne(
  { action: "initial_log" },
  { action: "replaced_log", user: "admin", timestamp: new Date() }
);
console.log("Замінений запис у журналі:", db.activity_logs.findOne({ action: "replaced_log" }, { _id: 0 }));

// deleteOne: видалення одного документа
db.activity_logs.insertOne({ action: "to_delete" });
db.activity_logs.deleteOne({ action: "to_delete" });
console.log("Запис to_delete після видалення:", db.activity_logs.findOne({ action: "to_delete" }));

// deleteMany: очищення тестових записів у capped колекції
// Примітка: у capped collections MongoDB дозволяє видалення або очищення за умови
console.log("Всі операції виконано успішно!");
