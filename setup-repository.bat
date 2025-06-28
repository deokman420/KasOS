@echo off
echo ===================================
echo 🚀 Setting up KasOS Repository...
echo ===================================

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo    Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Initialize Git repository if not already initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Check Git configuration
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚙️  Git user configuration needed
    echo Please run these commands to set up Git:
    echo    git config --global user.name "Your Name"
    echo    git config --global user.email "your.email@example.com"
    echo.
)

REM Add remote origin if not already added
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 Adding GitHub remote...
    git remote add origin https://github.com/deokman420/kasos.git
    echo ✅ Remote origin added
) else (
    echo ✅ Remote origin already configured
)

REM Show repository status
echo.
echo 📋 Repository Status:
echo    Remote: https://github.com/deokman420/kasos.git
echo    Ready for first commit
echo.

REM Stage all files
echo 📦 Staging files for commit...
git add .
echo ✅ Files staged

REM Show status
echo.
echo 📊 Git Status:
git status --short

echo.
echo 🎯 Next Steps:
echo 1. Review the staged files above
echo 2. Make your first commit:
echo    git commit -m "feat: initial KasOS repository with comprehensive versioning system"
echo.
echo 3. Push to GitHub:
echo    git push -u origin main
echo.
echo 4. Set up GitHub token for releases:
echo    set GITHUB_TOKEN=your_token_here
echo.
echo 5. Test the versioning system:
echo    npm run version
echo.
echo 🚀 Repository is ready for first commit!
pause
