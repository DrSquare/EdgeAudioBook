@echo off
REM EdgeAudioBook Quick Test Script for Windows
REM This script performs basic validation of the system

echo ==================================
echo EdgeAudioBook System Test
echo ==================================
echo.

set PASSED=0
set FAILED=0

echo 1. Checking Prerequisites...
echo ----------------------------

REM Check Python
where python >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo [PASS] Python installed: !PYTHON_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] Python not found
    set /a FAILED+=1
)

REM Check Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version 2^>^&1') do set NODE_VERSION=%%i
    echo [PASS] Node.js installed: !NODE_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] Node.js not found
    set /a FAILED+=1
)

REM Check npm
where npm >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version 2^>^&1') do set NPM_VERSION=%%i
    echo [PASS] npm installed: !NPM_VERSION!
    set /a PASSED+=1
) else (
    echo [FAIL] npm not found
    set /a FAILED+=1
)

echo.
echo 2. Checking Project Structure...
echo --------------------------------

if exist "backend" (
    echo [PASS] Backend directory exists
    set /a PASSED+=1
) else (
    echo [FAIL] Backend directory not found
    set /a FAILED+=1
)

if exist "frontend" (
    echo [PASS] Frontend directory exists
    set /a PASSED+=1
) else (
    echo [FAIL] Frontend directory not found
    set /a FAILED+=1
)

if exist "docs" (
    echo [PASS] Documentation directory exists
    set /a PASSED+=1
) else (
    echo [FAIL] Documentation directory not found
    set /a FAILED+=1
)

echo.
echo 3. Checking Backend Files...
echo ----------------------------

if exist "backend\run.py" (
    echo [PASS] Found backend\run.py
    set /a PASSED+=1
) else (
    echo [FAIL] Missing backend\run.py
    set /a FAILED+=1
)

if exist "backend\config.py" (
    echo [PASS] Found backend\config.py
    set /a PASSED+=1
) else (
    echo [FAIL] Missing backend\config.py
    set /a FAILED+=1
)

if exist "backend\requirements.txt" (
    echo [PASS] Found backend\requirements.txt
    set /a PASSED+=1
) else (
    echo [FAIL] Missing backend\requirements.txt
    set /a FAILED+=1
)

if exist "backend\app\__init__.py" (
    echo [PASS] Found backend\app\__init__.py
    set /a PASSED+=1
) else (
    echo [FAIL] Missing backend\app\__init__.py
    set /a FAILED+=1
)

echo.
echo 4. Checking Frontend Files...
echo -----------------------------

if exist "frontend\package.json" (
    echo [PASS] Found frontend\package.json
    set /a PASSED+=1
) else (
    echo [FAIL] Missing frontend\package.json
    set /a FAILED+=1
)

if exist "frontend\tsconfig.json" (
    echo [PASS] Found frontend\tsconfig.json
    set /a PASSED+=1
) else (
    echo [FAIL] Missing frontend\tsconfig.json
    set /a FAILED+=1
)

if exist "frontend\src\App.tsx" (
    echo [PASS] Found frontend\src\App.tsx
    set /a PASSED+=1
) else (
    echo [FAIL] Missing frontend\src\App.tsx
    set /a FAILED+=1
)

if exist "frontend\src\services\api.ts" (
    echo [PASS] Found frontend\src\services\api.ts
    set /a PASSED+=1
) else (
    echo [FAIL] Missing frontend\src\services\api.ts
    set /a FAILED+=1
)

echo.
echo 5. Checking Documentation...
echo ----------------------------

if exist "docs\PRD.md" (
    echo [PASS] Found docs\PRD.md
    set /a PASSED+=1
) else (
    echo [FAIL] Missing docs\PRD.md
    set /a FAILED+=1
)

if exist "docs\API_SPECIFICATION.md" (
    echo [PASS] Found docs\API_SPECIFICATION.md
    set /a PASSED+=1
) else (
    echo [FAIL] Missing docs\API_SPECIFICATION.md
    set /a FAILED+=1
)

if exist "docs\ARCHITECTURE.md" (
    echo [PASS] Found docs\ARCHITECTURE.md
    set /a PASSED+=1
) else (
    echo [FAIL] Missing docs\ARCHITECTURE.md
    set /a FAILED+=1
)

if exist "README.md" (
    echo [PASS] Found README.md
    set /a PASSED+=1
) else (
    echo [FAIL] Missing README.md
    set /a FAILED+=1
)

echo.
echo ==================================
echo Test Summary
echo ==================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED% equ 0 (
    echo All tests passed! √
    echo.
    echo Next steps:
    echo 1. Set up backend: cd backend ^&^& python -m venv venv ^&^& venv\Scripts\activate ^&^& pip install -r requirements.txt
    echo 2. Run backend: cd backend ^&^& python run.py
    echo 3. Set up frontend: cd frontend ^&^& npm install
    echo 4. Run frontend: cd frontend ^&^& npm run windows
    echo.
    echo See SETUP_GUIDE.md for detailed instructions.
    exit /b 0
) else (
    echo Some tests failed. Please check the errors above.
    echo.
    echo Common fixes:
    echo - Install missing prerequisites ^(Python, Node.js, npm^)
    echo - Ensure you're in the EdgeAudioBook root directory
    echo - Check that all files were cloned correctly
    exit /b 1
)
