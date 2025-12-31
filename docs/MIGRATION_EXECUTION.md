# Инструкция по выполнению миграции БД (Шаги 3-4)

## Статус выполнения

✅ **Шаг 1**: Обновление схемы (`drizzle/schema.ts`) - ЗАВЕРШЕНО  
✅ **Шаг 2**: Генерация миграции (`0002_expand_cities_table.sql`) - ЗАВЕРШЕНО  
⏳ **Шаг 3**: Применение миграции к БД - ТРЕБУЕТСЯ ВЫПОЛНЕНИЕ  
⏳ **Шаг 4**: Заполнение данными (15 городов) - ТРЕБУЕТСЯ ВЫПОЛНЕНИЕ

---

## Шаг 3: Применение миграции к базе данных

### Предварительные требования

1. **База данных MySQL** должна быть доступна
2. **DATABASE_URL** должен быть настроен в `.env`
3. **drizzle-kit** должен быть установлен (`npm install` уже выполнен)

### Проверка конфигурации

```bash
# Убедитесь что вы в корневой директории проекта
cd /path/to/GALOR

# Проверьте .env файл
cat .env | grep DATABASE_URL
# Должно быть: DATABASE_URL="mysql://user:password@host:port/database"
```

### Выполнение миграции

#### Вариант 1: Использование npm скрипта (рекомендуется)

```bash
npm run db:push
```

Это выполнит:
- `drizzle-kit generate` (уже сделано)
- `drizzle-kit migrate` (применит миграцию)

#### Вариант 2: Прямое выполнение drizzle-kit

```bash
npx drizzle-kit migrate
```

#### Вариант 3: Ручное применение SQL

Если drizzle-kit недоступен, выполните SQL напрямую:

```bash
mysql -u your_username -p your_database < drizzle/migrations/0002_expand_cities_table.sql
```

### Ожидаемый результат

```
✓ Migration 0002_expand_cities_table.sql applied successfully
✓ Added 7 columns to cities table:
  - countryCode (VARCHAR 2)
  - latitude (VARCHAR 20)
  - longitude (VARCHAR 20)
  - timezone (VARCHAR 50)
  - dataStartYear (INT)
  - dataEndYear (INT)
  - updatedAt (TIMESTAMP)
✓ Created indexes:
  - idx_cities_country_code
  - idx_cities_timezone
```

### Проверка выполнения

```sql
-- Войдите в MySQL
mysql -u your_username -p your_database

-- Проверьте структуру таблицы
DESCRIBE cities;

-- Должны увидеть все новые поля:
-- countryCode, latitude, longitude, timezone, 
-- dataStartYear, dataEndYear, updatedAt

-- Проверьте индексы
SHOW INDEX FROM cities;
```

### Устранение проблем

#### Ошибка: "Table 'cities' doesn't exist"

```sql
-- Создайте таблицу вручную
CREATE TABLE cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  population INT
);

-- Затем повторите миграцию
```

#### Ошибка: "Connection refused"

```bash
# Проверьте что MySQL запущен
sudo systemctl status mysql
# или
sudo service mysql status

# Проверьте доступность порта
telnet localhost 3306
```

#### Ошибка: "Access denied"

```bash
# Проверьте креденшалы в .env
# Проверьте права пользователя
mysql -u root -p

GRANT ALL PRIVILEGES ON your_database.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Шаг 4: Заполнение данными (15 городов)

### После успешного выполнения Шага 3

#### Вариант 1: Выполнение через MySQL CLI

```bash
mysql -u your_username -p your_database < drizzle/seed_cities.sql
```

#### Вариант 2: Копирование в MySQL консоль

```bash
# Войдите в MySQL
mysql -u your_username -p your_database

# Скопируйте и вставьте содержимое drizzle/seed_cities.sql
source drizzle/seed_cities.sql;
```

### Ожидаемый результат

```
Query OK, 15 rows affected

+-------------+-----------+------------+----------+
| total_cities| countries | data_start | data_end |
+-------------+-----------+------------+----------+
|          15 |        11 |       2015 |     2024 |
+-------------+-----------+------------+----------+

Successfully seeded 15 cities with complete 2015-2024 metadata
```

### Проверка данных

```sql
-- Подсчет городов по странам
SELECT 
  countryCode,
  country,
  COUNT(*) as city_count,
  GROUP_CONCAT(name ORDER BY population DESC) as cities
FROM cities
GROUP BY countryCode, country
ORDER BY country;

-- Должно вернуть:
-- DE (Germany): 2 города (Berlin, Munich)
-- US (United States): 4 города (New York, Los Angeles, Chicago, Washington D.C.)
-- FR (France): 1 город (Paris)
-- GB (United Kingdom): 1 город (London)
-- CA (Canada): 1 город (Toronto)
-- AT (Austria): 1 город (Vienna)
-- IT (Italy): 1 город (Rome)
-- NL (Netherlands): 1 город (Amsterdam)
-- BE (Belgium): 1 город (Brussels)
-- ES (Spain): 1 город (Madrid)
-- PL (Poland): 1 город (Warsaw)

-- Проверка координат и временных зон
SELECT name, latitude, longitude, timezone, dataStartYear, dataEndYear
FROM cities
LIMIT 5;
```

### Проверка целостности

```sql
-- Все города должны иметь координаты
SELECT COUNT(*) FROM cities WHERE latitude IS NULL OR longitude IS NULL;
-- Результат: 0

-- Все города должны иметь временную зону
SELECT COUNT(*) FROM cities WHERE timezone IS NULL;
-- Результат: 0

-- Проверка диапазона данных
SELECT 
  MIN(dataStartYear) as earliest,
  MAX(dataEndYear) as latest
FROM cities;
-- Результат: earliest=2015, latest=2024
```

---

## Финальная проверка всей системы

### 1. Структура БД

```bash
# Полная схема таблицы cities
mysql -u user -p -e "DESCRIBE your_database.cities;"
```

### 2. Данные

```bash
# Количество записей
mysql -u user -p -e "SELECT COUNT(*) FROM your_database.cities;"
# Должно быть: 15
```

### 3. Индексы

```bash
# Проверка индексов
mysql -u user -p -e "SHOW INDEX FROM your_database.cities;"
```

### 4. Тестовый запрос

```sql
-- Выборка городов с координатами
SELECT 
  name,
  country,
  CONCAT(latitude, ', ', longitude) as coordinates,
  timezone,
  population
FROM cities
WHERE countryCode IN ('DE', 'US', 'FR')
ORDER BY population DESC;
```

---

## Следующие шаги после миграции

### 1. Обновить DB_MIGRATION_GUIDE.md

Пометить Шаги 3 и 4 как завершённые:

```markdown
### Step 3: Apply Migration ✅ COMPLETED
### Step 4: Populate Data ✅ COMPLETED
```

### 2. Обновить код приложения

Теперь можно использовать новые поля в запросах:

```typescript
// server/routes/cities.ts
import { cities } from '../db/schema';

export const getCitiesWithCoordinates = async () => {
  return db.select({
    id: cities.id,
    name: cities.name,
    country: cities.country,
    countryCode: cities.countryCode,
    latitude: cities.latitude,
    longitude: cities.longitude,
    timezone: cities.timezone,
    dataRange: sql`CONCAT(${cities.dataStartYear}, '-', ${cities.dataEndYear})`
  }).from(cities);
};
```

### 3. Тестирование функционала

- Фильтрация по странам (countryCode)
- Отображение на карте (latitude, longitude)
- Временные зоны для данных
- Диапазон исторических данных (2015-2024)

---

## Откат (Rollback) в случае проблем

### Откат миграции

```sql
-- Удаление добавленных колонок
ALTER TABLE cities 
DROP COLUMN countryCode,
DROP COLUMN latitude,
DROP COLUMN longitude,
DROP COLUMN timezone,
DROP COLUMN dataStartYear,
DROP COLUMN dataEndYear,
DROP COLUMN updatedAt;

-- Удаление индексов
DROP INDEX idx_cities_country_code ON cities;
DROP INDEX idx_cities_timezone ON cities;
```

### Откат данных

```sql
-- Удаление всех данных
DELETE FROM cities WHERE id < 1000;

-- Или полная очистка
TRUNCATE TABLE cities;
```

---

## Резюме команд

```bash
# === ШАГ 3: ПРИМЕНЕНИЕ МИГРАЦИИ ===
cd /path/to/GALOR
npm run db:push
# или
npx drizzle-kit migrate
# или
mysql -u user -p database < drizzle/migrations/0002_expand_cities_table.sql

# === ШАГ 4: ЗАПОЛНЕНИЕ ДАННЫМИ ===
mysql -u user -p database < drizzle/seed_cities.sql

# === ПРОВЕРКА ===
mysql -u user -p database -e "SELECT COUNT(*) FROM cities;"
# Ожидаемый результат: 15

mysql -u user -p database -e "DESCRIBE cities;"
# Должно показать все 7 новых полей
```

---

## Контакты и поддержка

При возникновении проблем:
1. Проверьте логи MySQL: `sudo tail -f /var/log/mysql/error.log`
2. Проверьте права доступа к БД
3. Убедитесь что DATABASE_URL правильный в `.env`
4. Обратитесь к DB_MIGRATION_GUIDE.md для дополнительных деталей

**Дата создания**: 31 декабря 2025  
**Статус**: Готово к выполнению  
**Файлы**:  
- `drizzle/migrations/0002_expand_cities_table.sql` - SQL миграция  
- `drizzle/seed_cities.sql` - Данные для заполнения  
- `docs/DB_MIGRATION_GUIDE.md` - Общая документация
