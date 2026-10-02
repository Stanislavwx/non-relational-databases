# Лабораторна робота №2

**Тема:** Ознайомлення, інсталяція та налаштування документо-орієнтованої СКБД MongoDB

**Мета:** Вивчити основи MongoDB, встановити та налаштувати СКБД, попрактикуватися з JSON-форматом і створити власні документи для двох колекцій.

## Предметна область

Кінотека (фільми та режисери).

Спроектовано дві колекції:
- `movies` - інформація про фільми (назва, рік, жанр, рейтинг, актори, касові збори)
- `directors` - інформація про режисерів (ім'я, рік народження, національність, нагороди)

## Структура файлів

```
Lab2/
├── movies.json              # 3 документи колекції movies
├── directors.json            # 3 документи колекції directors
├── sample_open_data.json     # відкриті дані з JSONPlaceholder (users)
├── Lab2_report.docx          # звіт
└── README.md
```

## Опис колекцій

### movies

| Поле | Тип | Опис |
|------|-----|------|
| title | string | Назва фільму |
| year | number | Рік випуску |
| genre | string | Жанр |
| rating | number | Рейтинг IMDb |
| actors | array | Список акторів (масив) |
| box_office | object | Касові збори (вкладений документ) |
| director_id | number | ID режисера |
я
### directors

| Поле | Тип | Опис |
|------|-----|------|
| director_id | number | ID режисера |
| name | string | Ім'я |
| birth_year | number | Рік народження |
| nationality | string | Національність |
| notable_films | array | Відомі фільми (масив) |
| awards | object | Нагороди (вкладений документ) |

## Встановлення MongoDB (Linux/Fedora)

1. Додати репозиторій MongoDB:
```bash
sudo tee /etc/yum.repos.d/mongodb-org-8.0.repo <<EOF
[mongodb-org-8.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/8.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-8.0.asc
EOF
```

2. Встановити MongoDB:
```bash
sudo dnf install -y mongodb-org
```

3. Запустити сервіс:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

4. Встановити MongoDB Shell (mongosh):
```bash
sudo dnf install -y mongodb-mongosh
```
я
5. Перевірити версію:
```bash
mongosh --version
```

6. Встановити MongoDB Compass (GUI):
   - Завантажити з https://www.mongodb.com/try/download/compass
   - Встановити через rpm або flatpak

## Імпорт даних

```bash
mongoimport --db cinematheque --collection movies --jsonArray --file movies.json
mongoimport --db cinematheque --collection directors --jsonArray --file directors.json
```
