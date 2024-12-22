# Background Removal App

A web application that uses AI to remove backgrounds from images. Built with Next.js for the frontend and Flask for the backend, using the U2-Net model for background removal.

![image](https://github.com/user-attachments/assets/e0574c0a-e932-4abf-96b9-7f33b4befeff)

## Features

- Instant background removal from images
- Support for WEBP, PNG, JPEG, and JPG formats
- Drag and drop interface
- Sample images to try the service
- Image rotation tools
- Bulk download of processed images
- History of processed images
- Responsive design
- Available in English and Spanish
- Dark mode support

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Python, Flask, rembg (U2-Net)
- **Infrastructure**: Docker, Docker Compose

## Running Locally

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/cesar-bravo-m/background-removal-app.git
```

2. Navigate to the project directory:
```bash
cd background-removal-app
```

3. Build and run the Docker containers:
```bash
docker compose up --build
```

4. Create a .env file in the root directory with a random secret key:
```bash
SECRET_KEY=your_secret_key
```

5. Access the application at `http://localhost`.
