# Use the official Python image.
FROM python:3.8-slim

# Set the working directory.
WORKDIR /app

# Copy the requirements file.
COPY requirements.txt .

# Install dependencies.
RUN pip install -r requirements.txt

# Copy the rest of the application code.
COPY . .

# Run the application with Gunicorn.
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:3001", "wsgi:app"]