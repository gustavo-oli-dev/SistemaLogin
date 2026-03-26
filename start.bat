@echo off
chcp 65001 >nul
echo Iniciando Sistema de Login & Registro...
echo.

REM Iniciar Backend em uma nova janela
start cmd /k "cd backend && python app.py"

REM Aguardar um pouco para o backend iniciar
timeout /t 3 /nobreak

REM Iniciar Frontend em uma nova janela
start cmd /k "cd frontend && npm start"

echo.
echo ✓ Backend iniciado na porta 5000
echo ✓ Frontend iniciado na porta 3000
echo.
echo Acesse: http://localhost:3000
pause
