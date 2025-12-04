# WalkAware

WalkAware is an intelligent pedestrian safety application designed to detect crosswalks and alert users, helping to prevent accidents caused by distracted walking. The system consists of a Python FastAPI backend (with computer vision capabilities) and a React frontend.

**Live Application:** [walkaware.eu](https://walkaware.eu)

## Project Structure

The project is organized into the following main directories:

- **`backend/`**: The server-side application built with FastAPI.
    - **`app/`**: Contains core logic including Firestore providers, GCS upload handlers, notification services, and state management.
    - **`crosswalk-detection-model/`**: Holds the YOLOv11 model (`best.pt`) and training results.
    - **`main.py`**: The entry point for the FastAPI application.
    - **`prediction.py`**: Handles image processing and crosswalk detection using the YOLO model.
    - **`sockets.py`**: Manages real-time WebSocket communication with clients.
- **`frontend/`**: The client-side application built with React and Vite.
    - **`src/components/`**: UI components for both Pedestrian and Driver views.
    - **`src/context/`**: React contexts for managing global state (Driver, Pedestrian, Socket).
    - **`src/hooks/`**: Custom hooks for sensor data and services.
- **`local_storage/`**: A directory used in local development to store uploaded images instead of Google Cloud Storage.
- **`docker-compose.yml`**: Orchestrates the multi-container Docker environment for local development.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- Git.

## Setup with Docker

The recommended way to run the application is using Docker Compose. This sets up the entire environment, including the backend, frontend, and necessary environment variables for local development (mocking Google Cloud services).

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd walkaware
    ```

2.  **Start the application:**
    Run the following command in the root directory:
    ```bash
    docker-compose up --build
    ```

    This command will:
    - Build the backend and frontend images.
    - Start the services.
    - Configure the backend to use local mocks for Firestore and Storage (no GCP credentials required).
    - Enable debug features in the frontend.

3.  **Access the application:**
    - **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser.
    - **Backend API**: Accessible at [http://localhost:8000](http://localhost:8000).

## How to Use

1.  **Calibration**: Upon opening the app as a pedestrian, you may need to calibrate the sensors. Walk for 10 seconds while watching the screen, and then 10 seconds without watching the screen as instructed.
2.  **Start Detection**: Press the "Start" button.
3.  **Monitoring**:
    - If you are **watching the screen** while walking, the app sends camera frames to the backend.
    - The backend analyzes the frames for crosswalks.
    - If a crosswalk is detected and you are looking at the phone, you will receive an alert.
4.  **Driver View**: Drivers can switch to the driver interface to see alerts about pedestrians in their vicinity (simulated in this local environment).
5.  **Debug Features**: In this local Docker setup, you will see additional debug controls on the frontend (e.g., for manually setting location or testing sensor states) which are normally hidden in production.
6.  **Simulation Page**: You can visit [http://localhost:8000/test](http://localhost:8000/test) to simulate a driver approaching a crosswalk or a pedestrian's movement for testing purposes.

### Note on External Services (OSRM & Overpass API)

The application uses OSRM and Overpass API for crosswalk selection and routing. While these are typically self-hosted for performance, the private instances may not always be active due to hosting costs. In such cases, the system falls back to public endpoints, which may result in slower response times during these specific steps.

