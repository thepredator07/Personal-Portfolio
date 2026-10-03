@echo off
title Khubaib portfolio - local preview
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is not installed. Install the LTS version from https://nodejs.org
  echo  then double-click this file again.
  echo.
  start https://nodejs.org/en/download
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies - first run only, takes about a minute...
  call npm install
  if errorlevel 1 ( echo npm install failed. & pause & exit /b 1 )
)
echo.
echo Starting the site at http://localhost:3000  ^(close this window to stop^)
start "" cmd /c "timeout /t 6 >nul & start http://localhost:3000"
call npm run dev
pause
