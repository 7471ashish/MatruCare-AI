@echo off
echo ===================================================
echo  Starting MatruCare AI Hackathon Registration Portal
echo ===================================================
echo.
echo Make sure MongoDB is running locally (or MongoDB Atlas URI is set in server\.env)
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "MatruCare AI - Backend" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Client (Port 5173)...
start "MatruCare AI - Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Application started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo ===================================================
pause
