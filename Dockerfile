# Use Python 3.10 slim image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY app.py .
COPY gunicorn_config.py .
COPY hypertension_model.json .

# Expose port
EXPOSE 8080

# Run with gunicorn
CMD ["gunicorn", "app:app", "--config", "gunicorn_config.py"]
