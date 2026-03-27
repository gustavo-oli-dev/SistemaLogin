FROM python:3.11-slim

# Instalar Node.js 18
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependencias Python
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Instalar dependencias e buildar o frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Copiar backend
COPY backend/ ./backend/

EXPOSE 5000

CMD ["python", "backend/app.py"]
