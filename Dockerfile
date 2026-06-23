# Playwright image already contains browsers and dependencies
FROM mcr.microsoft.com/playwright/python:v1.54.0

WORKDIR /

# Copy requirements first for layer caching
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create database folder
RUN mkdir -p /app/data

# Create log folder
RUN mkdir -p /app/logs

# Run application
CMD ["python", "-m", "app.main"]