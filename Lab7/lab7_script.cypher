
// MATCH (n) DETACH DELETE n;

// ==============================================================================
// ЗАВДАННЯ 1: Створення вузлів з однією або більше мітками, робота з властивостями
// ==============================================================================

// 1.1. Створити вузол Movie з назвою "Forrest Gump"
CREATE (:Movie {title: 'Forrest Gump'});

// 1.2. Повернути щойно створений вузол за його назвою
MATCH (m:Movie)
WHERE m.title = 'Forrest Gump'
RETURN m;

// 1.3. Створити вузол Person з іменем "Robin Wright"
CREATE (:Person {name: 'Robin Wright'});

// 1.4. Повернути щойно створений вузол Person за його іменем
MATCH (p:Person)
WHERE p.name = 'Robin Wright'
RETURN p;

// 1.5. Додати мітку OlderMovie до будь-якого вузла Movie, випущеного до 2010 року
MATCH (m:Movie)
WHERE m.released < 2010
SET m:OlderMovie
RETURN DISTINCT labels(m);

// 1.6. Повернути вузли за допомогою нової мітки OlderMovie для перевірки
MATCH (m:OlderMovie)
RETURN m.title, m.released;

// 1.7. Додати мітку Female до всіх вузлів Person, чиє ім'я починається з "Robin"
MATCH (p:Person)
WHERE p.name STARTS WITH 'Robin'
SET p:Female;

// 1.8. Повернути імена всіх вузлів з міткою Female
MATCH (p:Female)
RETURN p.name;

// 1.9. Видалити мітку Female з вузлів, які її мають
MATCH (p:Female)
REMOVE p:Female;

// 1.10. Переглянути поточну схему графу
CALL db.schema.visualization();

// 1.11. Додати розширені властивості до фільму Forrest Gump
// Властивості: released = 1994, tagline, lengthInMinutes = 142 та мітка OlderMovie
MATCH (m:Movie)
WHERE m.title = 'Forrest Gump'
SET m:OlderMovie,
    m.released = 1994,
    m.tagline = "Life is like a box of chocolates...you never know what you're gonna get.",
    m.lengthInMinutes = 142;

// 1.12. Повернути вузол OlderMovie за назвою Forrest Gump для підтвердження оновлення
MATCH (m:OlderMovie)
WHERE m.title = 'Forrest Gump'
RETURN m;

// 1.13. Додати властивості до персони Robin Wright: born = 1966, birthPlace = 'Dallas'
MATCH (p:Person)
WHERE p.name = 'Robin Wright'
SET p.born = 1966, p.birthPlace = 'Dallas';

// 1.14. Повернути оновлений вузол Person Robin Wright
MATCH (p:Person)
WHERE p.name = 'Robin Wright'
RETURN p;

// 1.15. Видалити властивість lengthInMinutes із фільму Forrest Gump (через присвоєння null)
MATCH (m:Movie)
WHERE m.title = 'Forrest Gump'
SET m.lengthInMinutes = null;

// 1.16. Перевірити видалення властивості lengthInMinutes
MATCH (m:Movie)
WHERE m.title = 'Forrest Gump'
RETURN m;

// 1.17. Видалити властивість birthPlace з персони Robin Wright (через REMOVE)
MATCH (p:Person)
WHERE p.name = 'Robin Wright'
REMOVE p.birthPlace;

// 1.18. Перевірити видалення властивості birthPlace
MATCH (p:Person)
WHERE p.name = 'Robin Wright'
RETURN p;


// ==============================================================================
// ЗАВДАННЯ 2: Створення відношень (зв'язків) між вузлами та керування їх властивостями
// ==============================================================================

// Підготовчий крок: створення персон Tom Hanks, Gary Sinise, Robert Zemeckis (якщо ще не створені)
MERGE (p1:Person {name: 'Tom Hanks'})
ON CREATE SET p1.born = 1956;

MERGE (p2:Person {name: 'Gary Sinise'})
ON CREATE SET p2.born = 1955;

MERGE (p3:Person {name: 'Robert Zemeckis'})
ON CREATE SET p3.born = 1951;

// 2.1. Створити відношення ACTED_IN між акторами (Robin Wright, Tom Hanks, Gary Sinise) та Forrest Gump
MATCH (m:Movie)
WHERE m.title = 'Forrest Gump'
MATCH (p:Person)
WHERE p.name = 'Tom Hanks' OR p.name = 'Robin Wright' OR p.name = 'Gary Sinise'
CREATE (p)-[:ACTED_IN]->(m);

// 2.2. Створити відношення DIRECTED між Robert Zemeckis та фільмом Forrest Gump
MATCH (m:Movie)
WHERE m.title = 'Forrest Gump'
MATCH (p:Person)
WHERE p.name = 'Robert Zemeckis'
CREATE (p)-[:DIRECTED]->(m);

// 2.3. Створити відношення HELPED від Tom Hanks до Gary Sinise
MATCH (p1:Person)
WHERE p1.name = 'Tom Hanks'
MATCH (p2:Person)
WHERE p2.name = 'Gary Sinise'
CREATE (p1)-[:HELPED]->(p2);

// 2.4. Запит усіх вузлів та зв'язків, пов'язаних з фільмом Forrest Gump
MATCH (p:Person)-[rel]-(m:Movie)
WHERE m.title = 'Forrest Gump'
RETURN p, rel, m;

// 2.5. Додати властивість ролей roles до відношень ACTED_IN фільму Forrest Gump
MATCH (p:Person)-[rel:ACTED_IN]->(m:Movie)
WHERE m.title = 'Forrest Gump'
SET rel.roles =
  CASE p.name
    WHEN 'Tom Hanks' THEN ['Forrest Gump']
    WHEN 'Robin Wright' THEN ['Jenny Curran']
    WHEN 'Gary Sinise' THEN ['Lieutenant Dan Taylor']
  END;

// 2.6. Додати властивість research = 'war history' до відношення HELPED
MATCH (p1:Person)-[rel:HELPED]->(p2:Person)
WHERE p1.name = 'Tom Hanks' AND p2.name = 'Gary Sinise'
SET rel.research = 'war history';

// 2.7. Переглянути поточний список ключів властивостей у графі
CALL db.propertyKeys();

// 2.8. Переглянути оновлену схему графу
CALL db.schema.visualization();

// 2.9. Повернути імена акторів та їхні ролі у фільмі Forrest Gump
MATCH (p:Person)-[rel:ACTED_IN]->(m:Movie)
WHERE m.title = 'Forrest Gump'
RETURN p.name, rel.roles;

// 2.10. Повернути інформацію про відношення HELPED без вказання напрямку
// Повертає 2 результати в запиті без стрілки, оскільки з'єднання симетрично проходиться в обидва боки
MATCH (p1:Person)-[rel:HELPED]-(p2:Person)
RETURN p1.name, rel, p2.name;

// 2.11. Змінити властивість ролі Gary Sinise з 'Lieutenant Dan Taylor' на 'Lt. Dan Taylor'
MATCH (p:Person)-[rel:ACTED_IN]->(m:Movie)
WHERE m.title = 'Forrest Gump' AND p.name = 'Gary Sinise'
SET rel.roles = ['Lt. Dan Taylor'];

// 2.12. Видалити властивість research з відношення HELPED
MATCH (p1:Person)-[rel:HELPED]->(p2:Person)
WHERE p1.name = 'Tom Hanks' AND p2.name = 'Gary Sinise'
REMOVE rel.research;

// 2.13. Підтвердити внесення всіх змін до зв'язків фільму Forrest Gump
MATCH (p:Person)-[rel]-(m:Movie)
WHERE m.title = 'Forrest Gump'
RETURN p, rel, m;


// ==============================================================================
// ЗАВДАННЯ 3: Параметризація операторів Cypher та аналітичні запити
// ==============================================================================

// 3.0. Завантаження розширеного навчального датасету (Movie Graph) для перевірки запитів із рецензіями
CREATE (TheMatrix:Movie {title:'The Matrix', released:1999, tagline:'Welcome to the Real World'})
CREATE (Keanu:Person {name:'Keanu Reeves', born:1964})
CREATE (Carrie:Person {name:'Carrie-Anne Moss', born:1967})
CREATE (Laurence:Person {name:'Laurence Fishburne', born:1961})
CREATE (Hugo:Person {name:'Hugo Weaving', born:1960})
CREATE
  (Keanu)-[:ACTED_IN {roles:['Neo']}]->(TheMatrix),
  (Carrie)-[:ACTED_IN {roles:['Trinity']}]->(TheMatrix),
  (Laurence)-[:ACTED_IN {roles:['Morpheus']}]->(TheMatrix),
  (Hugo)-[:ACTED_IN {roles:['Agent Smith']}]->(TheMatrix);

CREATE (CloudAtlas:Movie {title:'Cloud Atlas', released:2012, tagline:'Everything is connected'})
CREATE (HalleB:Person {name:'Halle Berry', born:1966})
CREATE (JimB:Person {name:'Jim Broadbent', born:1949})
CREATE
  (TomH)-[:ACTED_IN {roles:['Zachry']}]->(CloudAtlas),
  (HalleB)-[:ACTED_IN {roles:['Luisa Rey']}]->(CloudAtlas),
  (JimB)-[:ACTED_IN {roles:['Vyvyan Ayrs']}]->(CloudAtlas);

CREATE (TheReplacements:Movie {title:'The Replacements', released:2000, tagline:'Pain heals. Chicks dig scars. Glory lasts forever.'})
CREATE (GeneH:Person {name:'Gene Hackman', born:1930})
CREATE (Brooke:Person {name:'Brooke Langton', born:1970})
CREATE
  (Keanu)-[:ACTED_IN {roles:['Shane Falco']}]->(TheReplacements),
  (GeneH)-[:ACTED_IN {roles:['Jimmy McGinty']}]->(TheReplacements),
  (Brooke)-[:ACTED_IN {roles:['Annabelle Farrell']}]->(TheReplacements);

CREATE (TheDaVinciCode:Movie {title:'The Da Vinci Code', released:2006, tagline:'Break The Codes'})
CREATE (IanM:Person {name:'Ian McKellen', born:1939})
CREATE (AudreyT:Person {name:'Audrey Tautou', born:1976})
CREATE
  (TomH)-[:ACTED_IN {roles:['Dr. Robert Langdon']}]->(TheDaVinciCode),
  (IanM)-[:ACTED_IN {roles:['Sir Leigh Teabing']}]->(TheDaVinciCode),
  (AudreyT)-[:ACTED_IN {roles:['Sophie Neveu']}]->(TheDaVinciCode);

CREATE (JerryMaguire:Movie {title:'Jerry Maguire', released:2000, tagline:'The rest of his life begins now.'})
CREATE (TomC:Person {name:'Tom Cruise', born:1962})
CREATE (CubaG:Person {name:'Cuba Gooding Jr.', born:1968})
CREATE (ReneeZ:Person {name:'Renee Zellweger', born:1969})
CREATE
  (TomC)-[:ACTED_IN {roles:['Jerry Maguire']}]->(JerryMaguire),
  (CubaG)-[:ACTED_IN {roles:['Rod Tidwell']}]->(JerryMaguire),
  (ReneeZ)-[:ACTED_IN {roles:['Dorothy Boyd']}]->(JerryMaguire);

CREATE (JessicaThompson:Person {name:'Jessica Thompson'})
CREATE (JamesThompson:Person {name:'James Thompson'})
CREATE (AngelaScope:Person {name:'Angela Scope'})
CREATE
  (JessicaThompson)-[:REVIEWED {summary:'An amazing journey', rating:95}]->(CloudAtlas),
  (JessicaThompson)-[:REVIEWED {summary:'Silly, but fun', rating:65}]->(TheReplacements),
  (JamesThompson)-[:REVIEWED {summary:'The coolest football movie ever', rating:100}]->(TheReplacements),
  (AngelaScope)-[:REVIEWED {summary:'Pretty funny at times', rating:62}]->(TheReplacements),
  (JessicaThompson)-[:REVIEWED {summary:'A solid romp', rating:68}]->(TheDaVinciCode),
  (JamesThompson)-[:REVIEWED {summary:'Fun, but a little far fetched', rating:65}]->(TheDaVinciCode),
  (JessicaThompson)-[:REVIEWED {summary:'You had me at Jerry', rating:92}]->(JerryMaguire);

// 3.1. Виконати аналітичний запит для пошуку рецензентів, оцінок та списку акторів фільмів
MATCH (r:Person)-[rel:REVIEWED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
RETURN DISTINCT r.name AS Reviewer, m.title AS Movie, m.released AS Released, rel.rating AS Rating, collect(a.name) AS Cast;

// 3.2. Додати параметр year зі значенням 2000 до сеансу Neo4j
// У Neo4j Browser виконується команда:
// :param year => 2000

// 3.3. Параметризований запит із фільтрацією за роком випуску ($year = 2000)
MATCH (r:Person)-[rel:REVIEWED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
WHERE m.released = $year
RETURN DISTINCT r.name AS Reviewer, m.title AS Movie, m.released AS Released, rel.rating AS Rating, collect(a.name) AS Cast;

// 3.4. Змінити значення параметра year на 2006 та повторити запит
// У Neo4j Browser:
// :param year => 2006
MATCH (r:Person)-[rel:REVIEWED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
WHERE m.released = $year
RETURN DISTINCT r.name AS Reviewer, m.title AS Movie, m.released AS Released, rel.rating AS Rating, collect(a.name) AS Cast;

// 3.5. Встановити комбінований набір параметрів year = 2006 та ratingValue = 65
// У Neo4j Browser:
// :params {year: 2006, ratingValue: 65}

// 3.6. Виконати запит із двома параметрами (m.released = $year AND rel.rating > $ratingValue)
MATCH (r:Person)-[rel:REVIEWED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
WHERE m.released = $year AND rel.rating > $ratingValue
RETURN DISTINCT r.name AS Reviewer, m.title AS Movie, m.released AS Released, rel.rating AS Rating, collect(a.name) AS Cast;

// 3.7. Змінити порогове значення ratingValue на 60 та перевірити зміну результату
// У Neo4j Browser:
// :params {year: 2006, ratingValue: 60}
MATCH (r:Person)-[rel:REVIEWED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
WHERE m.released = $year AND rel.rating > $ratingValue
RETURN DISTINCT r.name AS Reviewer, m.title AS Movie, m.released AS Released, rel.rating AS Rating, collect(a.name) AS Cast;


// ==============================================================================
// ЗАВДАННЯ 4: Створення, перегляд та видалення індексів
// ==============================================================================

// 4.1. Створити індекс для вузла Person за властивістю born
// Синтаксис з методички:
CREATE INDEX ON :Person(born);

// Сучасний синтаксис Neo4j 5.x (альтернативний):
// CREATE INDEX person_born_idx IF NOT EXISTS FOR (p:Person) ON (p.born);

// 4.2. Переглянути список створених індексів у системному каталозі
CALL db.indexes();
// Або в Neo4j 5.x:
// SHOW INDEXES;

// 4.3. Видалити створений індекс
// Синтаксис з методички:
DROP INDEX ON :Person(born);

// Сучасний синтаксис Neo4j 5.x (альтернативний):
// DROP INDEX person_born_idx IF EXISTS;


// ==============================================================================
// ДОДАТКОВИЙ РОЗДІЛ: Адаптація до предметної області «Бібліотечна система» (Варіант 6)
// ==============================================================================

// Створення вузлів авторів, книг, жанрів та читачів бібліотеки
CREATE (taras:Author:Person {name: 'Тарас Шевченко', birthYear: 1814, country: 'Україна'});
CREATE (lesya:Author:Person {name: 'Леся Українка', birthYear: 1871, country: 'Україна'});
CREATE (pidmohylny:Author:Person {name: 'Валер\'ян Підмогильний', birthYear: 1901, country: 'Україна'});

CREATE (kobzar:Book {title: 'Кобзар', year: 1840, pages: 115, isbn: '978-966-03-7501-1'});
CREATE (forestSong:Book {title: 'Лісова пісня', year: 1911, pages: 128, isbn: '978-966-03-8201-9'});
CREATE (misto:Book {title: 'Місто', year: 1928, pages: 256, isbn: '978-966-03-9102-8'});

CREATE (poetry:Genre {name: 'Поезія'});
CREATE (drama:Genre {name: 'Драма'});
CREATE (urbanNovel:Genre {name: 'Урбаністичний роман'});

CREATE (reader1:Reader:Person {name: 'Олександр Коваленко', ticketNumber: 'RD-1001', registered: 2024});
CREATE (reader2:Reader:Person {name: 'Марія Мельник', ticketNumber: 'RD-1002', registered: 2025});

// Створення зв'язків між вузлами бібліотеки
CREATE (taras)-[:WROTE]->(kobzar);
CREATE (lesya)-[:WROTE]->(forestSong);
CREATE (pidmohylny)-[:WROTE]->(misto);

CREATE (kobzar)-[:BELONGS_TO]->(poetry);
CREATE (forestSong)-[:BELONGS_TO]->(drama);
CREATE (misto)-[:BELONGS_TO]->(urbanNovel);

CREATE (reader1)-[:BORROWED {borrowDate: '2026-11-01', returned: true, days: 14}]->(kobzar);
CREATE (reader1)-[:BORROWED {borrowDate: '2026-11-15', returned: false, days: 5}]->(misto);
CREATE (reader2)-[:BORROWED {borrowDate: '2026-11-10', returned: true, days: 8}]->(forestSong);

CREATE (reader1)-[:REVIEWED {rating: 98, review: 'Фундаментальна класика'}]->(kobzar);
CREATE (reader2)-[:REVIEWED {rating: 92, review: 'Неймовірна поетичність та глибина'}]->(forestSong);

// Параметризований запит для бібліотеки: пошук популярних книг за рейтингом рецензій
// :params {minRating: 90}
MATCH (r:Reader)-[rev:REVIEWED]->(b:Book)<-[:WROTE]-(a:Author)
WHERE rev.rating >= $minRating
RETURN b.title AS Book, a.name AS Author, rev.rating AS Rating, r.name AS Reader;

// Створення індексу для книг за назвою
CREATE INDEX ON :Book(title);
// SHOW INDEXES;
