// ==============================================================================
// Лабораторна робота №5: Робота з масивами в MongoDB
// Дисципліна: Основи нереляційних баз даних
// Студент групи ФеП-32: Чепара Станіслав
// Предметна область: Бібліотека (колекції books та authors)
// ==============================================================================

db = db.getSiblingDB("library_db");

// Перевірка та ініціалізація тестового набору даних
db.books.drop();
console.log("Ініціалізація свіжих даних для лабораторної роботи №5...");
db.books.insertMany([
    {
      title: "Кобзар",
      year: 1840,
      genres: ["поезія", "класика"],
      pages: 115,
      price: 350,
      in_stock: true,
      ratings: [5, 4, 5, 4],
      author: { name: "Тарас Шевченко", country: "Україна", birth_year: 1814 }
    },
    {
      title: "Гайдамаки",
      year: 1841,
      genres: ["поезія", "історична поема"],
      pages: 140,
      price: 210,
      in_stock: true,
      ratings: [4, 4, 5],
      author: { name: "Тарас Шевченко", country: "Україна", birth_year: 1814 }
    },
    {
      title: "Захар Беркут",
      year: 1883,
      genres: ["історична повість", "класика"],
      pages: 240,
      price: 280,
      in_stock: true,
      ratings: [5, 5, 4, 5],
      author: { name: "Іван Франко", country: "Україна", birth_year: 1856 }
    },
    {
      title: "Борислав сміється",
      year: 1881,
      genres: ["роман", "соціальна проза"],
      pages: 310,
      price: 295,
      in_stock: false,
      ratings: [4, 3, 4],
      author: { name: "Іван Франко", country: "Україна", birth_year: 1856 }
    },
    {
      title: "Лісова пісня",
      year: 1911,
      genres: ["драма-феєрія", "фольклор"],
      pages: 160,
      price: 240,
      in_stock: true,
      ratings: [5, 5, 5, 5],
      author: { name: "Леся Українка", country: "Україна", birth_year: 1871 }
    },
    {
      title: "Тіні забутих предків",
      year: 1911,
      genres: ["повість", "фольклор"],
      pages: 180,
      price: 260,
      in_stock: true,
      ratings: [5, 4, 4, 5],
      author: { name: "Михайло Коцюбинський", country: "Україна", birth_year: 1864 }
    },
    {
      title: "Місто",
      year: 1928,
      genres: ["роман", "модернізм", "урбаністика"],
      pages: 300,
      price: 350,
      in_stock: true,
      ratings: [5, 5, 4, 4, 5],
      author: { name: "Валер'ян Підмогильний", country: "Україна", birth_year: 1901 }
    },
    {
      title: "Тигролови",
      year: 1944,
      genres: ["пригодницький роман", "класика"],
      pages: 320,
      price: 330,
      in_stock: true,
      ratings: [5, 5, 5, 4],
      author: { name: "Іван Багряний", country: "Україна", birth_year: 1906 }
    },
    {
      title: "Земля",
      year: 1902,
      genres: ["соціально-психологічна повість"],
      pages: 340,
      price: 275,
      in_stock: false,
      ratings: [4, 4, 4],
      author: { name: "Ольга Кобилянська", country: "Україна", birth_year: 1863 }
    },
    {
      title: "Маруся Чурай",
      year: 1979,
      genres: ["історичний роман у віршах", "поезія"],
      pages: 220,
      price: 390,
      in_stock: true,
      ratings: [5, 5, 5, 5],
      author: { name: "Ліна Костенко", country: "Україна", birth_year: 1930 }
    }
  ]);

console.log("=== ЛАБОРАТОРНА РОБОТА №5 ===");
console.log("Поточна база даних:", db.getName());
console.log("Кількість документів у books:", db.books.countDocuments());

// ==============================================================================
// 1. Запити вибірки з масиву з різними умовами вибірки
// ==============================================================================
console.log("\n--- 1. ВИБІРКА З МАСИВУ З РІЗНИМИ УМОВАМИ ---");

// 1.1. Пошук по одному параметру (книги з жанром "класика")
console.log("\n1.1. Пошук книг, які містять жанр 'класика':");
printjson(
  db.books.find(
    { genres: "класика" },
    { title: 1, genres: 1, _id: 0 }
  ).toArray()
);

// 1.2. Пошук по кількох параметрах з оператором $all
console.log("\n1.2. Пошук книг, які одночасно містять жанри 'поезія' та 'класика' ($all):");
printjson(
  db.books.find(
    { genres: { $all: ["поезія", "класика"] } },
    { title: 1, genres: 1, _id: 0 }
  ).toArray()
);

// 1.3. Пошук по конкретному індексу елемента масиву (перший жанр - 'роман')
console.log("\n1.3. Пошук книг, у яких перший жанр (індекс 0) дорівнює 'роман':");
printjson(
  db.books.find(
    { "genres.0": "роман" },
    { title: 1, genres: 1, _id: 0 }
  ).toArray()
);

// ==============================================================================
// 2. Запити вибірки по довжині масиву ($size)
// ==============================================================================
console.log("\n--- 2. ВИБІРКА ПО ДОВЖИНІ МАСИВУ ($size) ---");

// 2.1. Документи з кількістю жанрів рівною 2
console.log("\n2.1. Книги з довжиною масиву genres = 2:");
printjson(
  db.books.find(
    { genres: { $size: 2 } },
    { title: 1, genres: 1, _id: 0 }
  ).limit(3).toArray()
);

// 2.2. Документи з кількістю жанрів рівною 3
console.log("\n2.2. Книги з довжиною масиву genres = 3:");
printjson(
  db.books.find(
    { genres: { $size: 3 } },
    { title: 1, genres: 1, _id: 0 }
  ).toArray()
);

// 2.3. Документи з кількістю жанрів рівною 1
console.log("\n2.3. Книги з довжиною масиву genres = 1:");
printjson(
  db.books.find(
    { genres: { $size: 1 } },
    { title: 1, genres: 1, _id: 0 }
  ).toArray()
);

// ==============================================================================
// 3. Запити вибірки з масиву з елементами управління вибіркою ($slice)
// ==============================================================================
console.log("\n--- 3. УПРАВЛІННЯ ВИБІРКОЮ МАСИВУ ($slice) ---");

// 3.1. Вибірка першого елемента масиву ($slice: 1)
console.log("\n3.1. Отримання першого жанру книги 'Місто' ($slice: 1):");
printjson(
  db.books.find(
    { title: "Місто" },
    { title: 1, genres: { $slice: 1 }, _id: 0 }
  ).toArray()
);

// 3.2. Вибірка останнього елемента масиву ($slice: -1)
console.log("\n3.2. Отримання останнього жанру книги 'Місто' ($slice: -1):");
printjson(
  db.books.find(
    { title: "Місто" },
    { title: 1, genres: { $slice: -1 }, _id: 0 }
  ).toArray()
);

// 3.3. Вибірка діапазону: пропустити 1 елемент і взяти 2 наступних
console.log("\n3.3. Вибірка 2 жанрів, починаючи з другого ($slice: [1, 2]):");
printjson(
  db.books.find(
    { title: "Місто" },
    { title: 1, genres: { $slice: [1, 2] }, _id: 0 }
  ).toArray()
);

// 3.4. Вибірка з кінця: починаючи з другого з кінця взяти один елемент
console.log("\n3.4. Вибірка одного жанру з кінця з пропуском 1 ($slice: [-2, 1]):");
printjson(
  db.books.find(
    { title: "Місто" },
    { title: 1, genres: { $slice: [-2, 1] }, _id: 0 }
  ).toArray()
);

// ==============================================================================
// 4. Додавання нових даних до масиву ($push, $addToSet, $each)
// ==============================================================================
console.log("\n--- 4. ДОДАВАННЯ ДАНИХ ДО МАСИВУ ---");

// 4.1. Додавання елемента без перевірки унікальності ($push)
console.log("\n4.1. Додавання елемента 'драма' в масив genres книги 'Кобзар' ($push):");
let pushRes = db.books.updateOne(
  { title: "Кобзар" },
  { $push: { genres: "драма" } }
);
printjson(pushRes);
printjson(db.books.findOne({ title: "Кобзар" }, { title: 1, genres: 1, _id: 0 }));

// 4.2. Додавання унікальних елементів ($addToSet)
console.log("\n4.2.1. Спроба додати вже наявний жанр 'драма' ($addToSet - дублікат ігнорується):");
let addDupRes = db.books.updateOne(
  { title: "Кобзар" },
  { $addToSet: { genres: "драма" } }
);
printjson(addDupRes);

console.log("\n4.2.2. Додавання нового унікального елемента 'ілюстроване видання' ($addToSet):");
let addNewRes = db.books.updateOne(
  { title: "Кобзар" },
  { $addToSet: { genres: "ілюстроване видання" } }
);
printjson(addNewRes);
printjson(db.books.findOne({ title: "Кобзар" }, { title: 1, genres: 1, _id: 0 }));

// 4.3. Додавання кількох елементів одночасно ($push + $each)
console.log("\n4.3. Додавання одразу кількох жанрів ['епос', 'героїка'] до книги 'Захар Беркут' ($push + $each):");
let pushEachRes = db.books.updateOne(
  { title: "Захар Беркут" },
  { $push: { genres: { $each: ["епос", "героїка"] } } }
);
printjson(pushEachRes);
printjson(db.books.findOne({ title: "Захар Беркут" }, { title: 1, genres: 1, _id: 0 }));

// ==============================================================================
// 5. Вилучення елементів з масиву ($pop, $pull, $pullAll)
// ==============================================================================
console.log("\n--- 5. ВИЛУЧЕННЯ ЕЛЕМЕНТІВ З МАСИВУ ---");

// 5.1. Вилучення останнього (1) та першого (-1) елемента через $pop
console.log("\n5.1.1. Вилучення останнього елемента з genres книги 'Кобзар' ($pop: 1):");
let popLastRes = db.books.updateOne(
  { title: "Кобзар" },
  { $pop: { genres: 1 } }
);
printjson(popLastRes);
printjson(db.books.findOne({ title: "Кобзар" }, { title: 1, genres: 1, _id: 0 }));

console.log("\n5.1.2. Вилучення першого елемента з genres книги 'Захар Беркут' ($pop: -1):");
let popFirstRes = db.books.updateOne(
  { title: "Захар Беркут" },
  { $pop: { genres: -1 } }
);
printjson(popFirstRes);
printjson(db.books.findOne({ title: "Захар Беркут" }, { title: 1, genres: 1, _id: 0 }));

// 5.2. Вилучення конкретного елемента за значенням ($pull)
console.log("\n5.2. Вилучення значення 'епос' з книги 'Захар Беркут' ($pull):");
let pullRes = db.books.updateOne(
  { title: "Захар Беркут" },
  { $pull: { genres: "епос" } }
);
printjson(pullRes);
printjson(db.books.findOne({ title: "Захар Беркут" }, { title: 1, genres: 1, _id: 0 }));

// 5.3. Вилучення кількох елементів ($pullAll)
console.log("\n5.3. Вилучення елементів ['роман', 'модернізм'] з книги 'Місто' ($pullAll):");
let pullAllRes = db.books.updateOne(
  { title: "Місто" },
  { $pullAll: { genres: ["роман", "модернізм"] } }
);
printjson(pullAllRes);
printjson(db.books.findOne({ title: "Місто" }, { title: 1, genres: 1, _id: 0 }));

// ==============================================================================
// 6. Зміна значень масиву ($set, $inc)
// ==============================================================================
console.log("\n--- 6. ЗМІНА ЗНАЧЕНЬ МАСИВУ ---");

// 6.1. Зміна значення конкретного елемента за індексом ($set)
console.log("\n6.1. Зміна першого елемента (індекс 0) у книзі 'Земля' ($set):");
let setRes = db.books.updateOne(
  { title: "Земля" },
  { $set: { "genres.0": "соціальна повість" } }
);
printjson(setRes);
printjson(db.books.findOne({ title: "Земля" }, { title: 1, genres: 1, _id: 0 }));

// 6.2. Зміна числового елемента масиву за індексом ($inc)
console.log("\n6.2. Збільшення першої оцінки (ratings.0) книги 'Кобзар' на 1 ($inc):");
console.log("До оновлення ratings:", db.books.findOne({ title: "Кобзар" }, { ratings: 1, _id: 0 }));
let incRes = db.books.updateOne(
  { title: "Кобзар" },
  { $inc: { "ratings.0": 1 } }
);
printjson(incRes);
console.log("Після оновлення ratings:", db.books.findOne({ title: "Кобзар" }, { ratings: 1, _id: 0 }));

// ==============================================================================
// 7. Робота з регулярними виразами ($regex)
// ==============================================================================
console.log("\n--- 7. РЕГУЛЯРНІ ВИРАЗИ ($regex) ---");

// 7.1. Пошук книг, назва яких починається з літери 'Т' (метасимвол ^)
console.log("\n7.1. Книги, назва яких починається з 'Т' (^Т):");
printjson(
  db.books.find(
    { title: { $regex: "^Т" } },
    { title: 1, year: 1, _id: 0 }
  ).toArray()
);

// 7.2. Пошук книг, назва яких закінчується на літеру 'я' (метасимвол $)
console.log("\n7.2. Книги, назва яких закінчується на 'я' (я$):");
printjson(
  db.books.find(
    { title: { $regex: "я$" } },
    { title: 1, year: 1, _id: 0 }
  ).toArray()
);

// 7.3. Пошук за шаблоном без врахування регістру (опція 'i')
console.log("\n7.3. Пошук книги 'кобзар' у нижньому регістрі (опція 'i'):");
printjson(
  db.books.find(
    { title: { $regex: "^кобзар$", $options: "i" } },
    { title: 1, year: 1, _id: 0 }
  ).toArray()
);

console.log("\n=== Виконання скрипта успішно завершено ===");
