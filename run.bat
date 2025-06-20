@echo off
REM ───────────────────────────────────────────────────────────────
REM  Simple launcher for Next.js dev + open browser + stay open
REM ───────────────────────────────────────────────────────────────
cd /d "%~dp0"

REM 1) (Optional) Install deps once.  Comment out if you don’t need it every time.
REM echo Installing dependencies...
REM npm install

REM 2) Launch the dev server in a separate window (keeps that window open):
echo Starting Next.js dev server...
start "NextJS Dev" cmd /k "cd /d %~dp0 && npm run dev"

REM 3) Give it a few seconds to boot
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM 4) Open your default browser
echo Opening http://localhost:3000 in your browser...
start "" "http://localhost:3000"

REM 5) Hold this window open so you can see messages/errors
echo.
echo Dev server launched.  This launcher window will remain open.
echo Press any key to close it
pause >nul