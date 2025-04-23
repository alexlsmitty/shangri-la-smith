@echo off
ECHO ========================
ECHO Shangri-La Beach Resort
ECHO GitHub Pages Deployment
ECHO ========================

ECHO.
ECHO 1. Cleaning previous build...
IF EXIST "dist" rd /s /q "dist"

ECHO.
ECHO 2. Building for GitHub Pages...
call npm run build:github

ECHO.
ECHO 3. Verifying build...
if not exist "dist\index.html" (
  ECHO Build failed! dist/index.html not found.
  EXIT /B 1
)

ECHO.
ECHO 4. Creating 404.html for SPA routing...
copy "dist\index.html" "dist\404.html"

ECHO.
ECHO 5. Verifying paths in index.html...
findstr /C:"<base href=\"/shangri-la-smith/\">" "dist\index.html" >nul
IF %ERRORLEVEL% NEQ 0 (
  ECHO Warning: Base tag missing! Editing index.html...
  powershell -Command "(Get-Content dist\index.html) -replace '<meta charset=\"UTF-8\">', '<meta charset=\"UTF-8\">\n    <base href=\"/shangri-la-smith/\">' | Set-Content dist\index.html"
  powershell -Command "(Get-Content dist\404.html) -replace '<meta charset=\"UTF-8\">', '<meta charset=\"UTF-8\">\n    <base href=\"/shangri-la-smith/\">' | Set-Content dist\404.html"
)

ECHO.
ECHO Build complete! Files are ready in the dist directory.
ECHO To deploy to GitHub Pages:
ECHO 1. Commit and push these changes
ECHO 2. Go to your repository settings
ECHO 3. Under GitHub Pages, ensure it's set to deploy from the /dist folder

ECHO.
ECHO ===== SUCCESS =====
