@echo off
chcp 65001 >nul
echo.
echo ==========================================
echo  GIT PUSH - Sistema de Login & Registro
echo ==========================================
echo.

REM Verificar se o Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git não está instalado! Baixe em: https://git-scm.com/
    pause
    exit /b 1
)

echo 📋 Status atual do repositório:
echo.
git status
echo.
echo.

REM Solicitar informações do repositório
set /p REPO_URL="🔗 Cole a URL do seu repositório no GitHub (https://github.com/...): "

if "%REPO_URL%"=="" (
    echo ❌ URL do repositório não fornecida!
    pause
    exit /b 1
)

echo.
echo ⏳ Atualizando referência remota...
git remote set-url origin "%REPO_URL%"

echo.
echo 📦 Adicionando todos os arquivos...
git add .

set /p COMMIT_MSG="💬 Digite a mensagem de commit (padrão: Initial commit): "
if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Initial commit
)

echo.
echo 📝 Fazendo commit...
git commit -m "%COMMIT_MSG%"

if errorlevel 1 (
    echo ℹ️  Nenhum arquivo para commit.
) else (
    echo ✓ Commit realizado!
)

echo.
echo 🚀 Enviando para o repositório remoto...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Erro no push! Verifique:
    echo    1. A URL do repositório
    echo    2. Suas credenciais do GitHub
    echo    3. Se a branch 'main' existe no repositório
) else (
    echo.
    echo ✅ Sucesso! Projeto enviado para GitHub!
    echo.
    echo 🔗 Acesse: %REPO_URL%
)

echo.
pause
