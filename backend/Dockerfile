# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory in container
WORKDIR /app

RUN mkdir -p /app/uploads

RUN mkdir -p /root/.u2net

# Install system dependencies required for Pillow and rembg
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx -O /root/.u2net/u2net.onnx

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install build waitress

# Copy the rest of the application
COPY . .

RUN python -m build --wheel

RUN pip install dist/*.whl

# Expose port 5000
EXPOSE 5000

# Command to run the application
CMD ["waitress-serve", "--host", "0.0.0.0", "--port", "5000", "--call", "app:create_app"]
#CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5000"]
