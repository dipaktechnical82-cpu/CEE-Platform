FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /workspace

# Install system dependencies needed for compiling psycopg if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements/ apps/api/requirements/
RUN pip install --upgrade pip && \
    pip install -r apps/api/requirements/dev.txt

COPY apps/api/ apps/api/

WORKDIR /workspace/apps/api

EXPOSE 8000
