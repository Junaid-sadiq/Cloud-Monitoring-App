# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire Flask API codebase
COPY . .

# Expose port 5000 for the Flask app
EXPOSE 5000

# Start the Flask API
CMD ["python", "app.py"]