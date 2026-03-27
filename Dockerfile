FROM python:3.11-slim

WORKDIR /app

# Copiar requirements primeiro para cache
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Expor porta
EXPOSE 5000

# Comando para iniciar
CMD ["python", "backend/app.py"]