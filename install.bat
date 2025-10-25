@echo off
echo ========================================
echo QIOS - Quality Integrated Omni System
echo ========================================
echo.
echo Installing dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available!
    echo Please reinstall Node.js
    echo.
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Copy env.example to .env.local
echo 2. Edit .env.local with your configuration
echo 3. Run: npm run dev
echo.
echo The application will be available at:
echo http://localhost:3000
echo.
pause
