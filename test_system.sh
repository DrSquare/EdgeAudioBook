#!/bin/bash

# EdgeAudioBook Quick Test Script
# This script performs basic validation of the system

echo "=================================="
echo "EdgeAudioBook System Test"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        FAILED=$((FAILED + 1))
    fi
}

echo "1. Checking Prerequisites..."
echo "----------------------------"

# Check Python
if command_exists python3 || command_exists python; then
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version 2>&1)
    else
        PYTHON_VERSION=$(python --version 2>&1)
    fi
    print_result 0 "Python installed: $PYTHON_VERSION"
else
    print_result 1 "Python not found"
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version 2>&1)
    print_result 0 "Node.js installed: $NODE_VERSION"
else
    print_result 1 "Node.js not found"
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version 2>&1)
    print_result 0 "npm installed: $NPM_VERSION"
else
    print_result 1 "npm not found"
fi

echo ""
echo "2. Checking Project Structure..."
echo "--------------------------------"

# Check if directories exist
if [ -d "backend" ]; then
    print_result 0 "Backend directory exists"
else
    print_result 1 "Backend directory not found"
fi

if [ -d "frontend" ]; then
    print_result 0 "Frontend directory exists"
else
    print_result 1 "Frontend directory not found"
fi

if [ -d "docs" ]; then
    print_result 0 "Documentation directory exists"
else
    print_result 1 "Documentation directory not found"
fi

echo ""
echo "3. Checking Backend Files..."
echo "----------------------------"

# Check backend files
BACKEND_FILES=(
    "backend/run.py"
    "backend/config.py"
    "backend/requirements.txt"
    "backend/app/__init__.py"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Found $file"
    else
        print_result 1 "Missing $file"
    fi
done

echo ""
echo "4. Checking Frontend Files..."
echo "-----------------------------"

# Check frontend files
FRONTEND_FILES=(
    "frontend/package.json"
    "frontend/tsconfig.json"
    "frontend/src/App.tsx"
    "frontend/src/services/api.ts"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Found $file"
    else
        print_result 1 "Missing $file"
    fi
done

echo ""
echo "5. Checking Documentation..."
echo "----------------------------"

# Check documentation files
DOC_FILES=(
    "docs/PRD.md"
    "docs/API_SPECIFICATION.md"
    "docs/ARCHITECTURE.md"
    "README.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_result 0 "Found $file"
    else
        print_result 1 "Missing $file"
    fi
done

echo ""
echo "6. Validating Python Syntax..."
echo "-------------------------------"

if command_exists python3 || command_exists python; then
    PYTHON_CMD="python3"
    if ! command_exists python3; then
        PYTHON_CMD="python"
    fi
    
    cd backend 2>/dev/null
    if [ $? -eq 0 ]; then
        $PYTHON_CMD -m py_compile run.py 2>/dev/null
        print_result $? "Backend Python syntax check"
        cd ..
    else
        print_result 1 "Could not access backend directory"
    fi
else
    echo -e "${YELLOW}⊘ SKIPPED${NC}: Python not available"
fi

echo ""
echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set up backend: cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    echo "2. Run backend: cd backend && python run.py"
    echo "3. Set up frontend: cd frontend && npm install"
    echo "4. Run frontend: cd frontend && npm run windows"
    echo ""
    echo "See SETUP_GUIDE.md for detailed instructions."
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the errors above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Install missing prerequisites (Python, Node.js, npm)"
    echo "- Ensure you're in the EdgeAudioBook root directory"
    echo "- Check that all files were cloned correctly"
    exit 1
fi
