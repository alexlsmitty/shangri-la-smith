@echo off
echo ===================================================
echo    Shangri-La Beach Resort - GitHub Pages Deploy
echo ===================================================
echo.

echo Adding all changes to git...
git add .

echo.
echo Committing changes...
git commit -m "Fix GitHub Pages deployment with simplified approach"

echo.
echo Pushing to GitHub...
git push

echo.
echo ===================================================
echo Deployment process initiated!
echo.
echo Your changes have been pushed to the main branch.
echo The GitHub Actions workflow should now be running.
echo.
echo Check the Actions tab in your repository to monitor
echo the deployment progress:
echo https://github.com/alexlsmitty/shangri-la-smith/actions
echo.
echo Once complete, your site will be available at:
echo https://alexlsmitty.github.io/shangri-la-smith/
echo ===================================================
pause
