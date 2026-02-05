@echo off
echo Pushing code to GitHub...
"C:\Users\SANJIKA\AppData\Local\GitHubDesktop\app-3.4.12\resources\app\git\cmd\git.exe" push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo Push failed! You might need to sign in.
    echo Please check the error message above.
) else (
    echo.
    echo Push successful!
)
pause
