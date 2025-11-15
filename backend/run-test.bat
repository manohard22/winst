@echo off
REM Wait for backend to start
timeout /t 4 /nobreak

REM Run the payment test
cd /d "e:\winst project\winst\backend"
node test-payment-direct.js

pause
