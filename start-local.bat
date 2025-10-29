@echo off
echo Starting AgroConnect Local Development Environment
echo ================================================

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo npm found:
npm --version

echo.
echo ================================================
echo Starting Frontend Development Server
echo ================================================

cd frontend

echo Installing frontend dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting Vite development server...
echo.
echo The application will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ================================================

call npm run dev

pause