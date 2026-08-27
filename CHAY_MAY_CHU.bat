@echo off
chcp 65001 >nul
title HE THONG THCS-LMS SERVER
echo ========================================================
echo   DANG KHOI DONG HE THONG THCS-LMS (PORT 8080)...
echo ========================================================
echo.
cd /d "%~dp0"
node server.js
pause
