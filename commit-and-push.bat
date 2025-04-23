@echo off
echo ======================================
echo Shangri-La Beach Resort GitHub Pages Fix
echo ======================================

echo.
echo Adding files to git...
git add .

echo.
echo Committing changes...
git commit -m "Fix GitHub Pages deployment with bash-based build corrections"

echo.
echo Pushing to GitHub...
git push

echo.
echo ======================================
echo Process completed!
echo.
echo Your changes have been pushed to GitHub
echo The GitHub Actions workflow should now be triggered
echo Check the Actions tab in your repository for progress
echo ======================================
pause
