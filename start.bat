@echo off
echo ========================================
echo QIOS - Quality Integrated Omni System
echo ========================================
echo.
echo Starting development server...
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo WARNING: .env.local not found!
    echo Please copy env.example to .env.local and configure it.
    echo.
    echo Copying env.example to .env.local...
    copy env.example .env.local
    echo.
    echo Please edit .env.local with your configuration before continuing.
    echo.
    pause
)

echo Starting Next.js development server...
echo The application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
