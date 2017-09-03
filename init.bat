@ECHO OFF 
for /f "tokens=1,2,3,4,*" %%i in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\xinhaiapptools" ^| find /i "apptools"') do SET "appPath=%%k" 
if "%appPath%"=="" (echo xinhai_app_tools is not found£¡) else (
echo npm modules is importing...
if not exist "%~dp0\node_modules\" md %~dp0\node_modules
xcopy %appPath%\node_modules %~dp0\node_modules /e /q /h
echo import success!
)
call ionic state restore
call ionic resources
pause