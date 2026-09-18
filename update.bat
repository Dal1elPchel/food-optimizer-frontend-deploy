@echo off

cd /d backend\FoodOptimizer

echo ==============================
echo     Git Pull
echo ==============================
git pull

echo.
echo ==============================
echo     Docker Down
echo ==============================
docker compose down

echo.
echo ==============================
echo     Docker Build
echo ==============================
docker compose build --no-cache

echo.
echo ==============================
echo     Docker Up
echo ==============================
docker compose up -d

if "%1"=="1" (
    echo.
    echo ==============================
    echo     Opening Swagger
    echo ==============================
    start "" "http://localhost:50001/swagger"
)

echo.
echo ==============================
echo          DONE
echo ==============================

pause