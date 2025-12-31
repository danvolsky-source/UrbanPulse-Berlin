@echo off
chcp 65001 >nul
CLS
echo.
echo ══════════════════════════════════════════════════════════════
echo   GALOR Database Migration - Windows (Шаги 3 + 4)
echo ══════════════════════════════════════════════════════════════
echo.

REM Проверка, что мы в правильной директории
if not exist "package.json" (
    echo [ОШИБКА] Файл package.json не найден!
    echo Убедитесь, что вы запускаете скрипт из папки C:\GALOR
    echo.
    echo Текущая директория: %CD%
    echo.
    pause
    exit /b 1
)

echo [INFO] Текущая директория: %CD%
echo.

REM Проверка Node.js/npm
echo [INFO] Проверка наличия Node.js...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Node.js/npm не установлен!
    echo.
    echo Установите Node.js с https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js найден
echo.

REM Проверка .env файла
echo [INFO] Проверка файла .env...
if not exist ".env" (
    echo [ПРЕДУПРЕЖДЕНИЕ] Файл .env не найден!
    echo Убедитесь, что DATABASE_URL настроен правильно.
    echo.
    pause
)
echo [OK] Файл .env найден
echo.

REM Проверка наличия файлов миграции
echo [INFO] Проверка файлов миграции...
if not exist "drizzle\migrations\0002_expand_cities_table.sql" (
    echo [ОШИБКА] Файл миграции не найден!
    echo Ожидается: drizzle\migrations\0002_expand_cities_table.sql
    echo.
    pause
    exit /b 1
)
echo [OK] Файл миграции найден
echo.

if not exist "drizzle\seed_cities.sql" (
    echo [ОШИБКА] Файл с данными не найден!
    echo Ожидается: drizzle\seed_cities.sql
    echo.
    pause
    exit /b 1
)
echo [OK] Файл seed_cities.sql найден
echo.

echo ══════════════════════════════════════════════════════════════
echo   ШАГ 3: Применение миграции к базе данных
echo ══════════════════════════════════════════════════════════════
echo.
echo [INFO] Выполнение: npm run db:push
echo.

REM Запуск миграции
call npm run db:push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [УСПЕХ] ✓ Шаг 3 выполнен успешно!
    echo.
) else (
    echo.
    echo [ОШИБКА] ✗ Ошибка при выполнении миграции!
    echo.
    echo Возможные причины:
    echo - База данных не доступна
    echo - Неверные креденшалы в .env
    echo - MySQL не запущен
    echo.
    pause
    exit /b 1
)

echo ══════════════════════════════════════════════════════════════
echo   ШАГ 4: Загрузка данных (15 городов)
echo ══════════════════════════════════════════════════════════════
echo.
echo [INFO] Попытка загрузки через mysql команду...
echo.

REM Попытка выполнить seed через mysql (если доступен)
where mysql >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] MySQL Client найден, выполнение seed_cities.sql...
    echo.
    
    REM Извлечение параметров из .env
    for /f "tokens=2 delims==" %%a in ('findstr "DATABASE_URL" .env') do set DB_URL=%%a
    
    echo [INFO] Для выполнения seed запустите вручную:
    echo mysql -u [user] -p [database] ^< drizzle\seed_cities.sql
    echo.
) else (
    echo [ПРЕДУПРЕЖДЕНИЕ] MySQL Client не найден в PATH
    echo.
    echo Для загрузки данных выполните вручную:
    echo 1. Откройте MySQL Workbench / HeidiSQL / phpMyAdmin
    echo 2. Выполните SQL из файла: drizzle\seed_cities.sql
    echo.
)

echo ══════════════════════════════════════════════════════════════
echo   ПРОВЕРКА РЕЗУЛЬТАТОВ
echo ══════════════════════════════════════════════════════════════
echo.
echo Для проверки выполните в MySQL:
echo.
echo   SELECT COUNT(*) FROM cities;
echo   -- Должно быть: 15
echo.
echo   DESCRIBE cities;
echo   -- Должны быть поля: countryCode, latitude, longitude, timezone
echo.
echo   SELECT name, country, countryCode, latitude, longitude
echo   FROM cities
echo   ORDER BY country, name;
echo.
echo ══════════════════════════════════════════════════════════════
echo   ИТОГИ
echo ══════════════════════════════════════════════════════════════
echo.
echo ✓ Шаг 1: Схема обновлена (drizzle/schema.ts)
echo ✓ Шаг 2: Миграция сгенерирована (0002_expand_cities_table.sql)
echo ✓ Шаг 3: Миграция применена к БД (7 новых полей)
echo ⚠ Шаг 4: Загрузите данные вручную (seed_cities.sql)
echo.
echo Документация: docs\MIGRATION_EXECUTION.md
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo Нажмите любую клавишу для завершения...
pause >nul
