# Chat Application By Rahul

## Description

I got an idea to develop this chat application when I was randomly using WhatsApp as everyone does.😅  
This is a real-time chat application built using the MERN (MongoDB, Express, React, Node.js) stack. 

## Features

- **Real-time Updates**: Messages are updated in real-time using WebSockets (Socket.IO).
- **Responsive UI**: The user interface is fully responsive and works on all devices.
- **Easy to Use**: The application features a user-friendly interface.
- **REST API**: The backend follows REST API guidelines for clear and organized code.
- **Scalable Backend**: The backend is designed to allow for the easy addition of new features.

## Installation

### Prerequisites

Make sure you have the following installed on your system:

- Node.js
- Git
- MongoDB

### Clone the Repository

```bash
git clone https://github.com/imRahulAgarwal/ChatAppByRahul.git
cd ChatAppByRahul
```

### Backend Setup

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the server directory and add the following environment variables:

    ```env
    PORT=
    MONGO_URL=
    ENV=DEVELOPMENT
    ALLOWED_ORIGINS=http://localhost:5173,
    JWT_SECRET=
    APPWRITE_API_KEY=
    APPWRITE_PROJECT_ID=
    APPWRITE_API_ENDPOINT=https://cloud.appwrite.io/v1
    APPWRITE_PROFILE_BUCKET_ID=
    DEFAULT_IMAGE_ID=
    RESET_PASSWORD_PAGE=http://localhost:5173/reset-password
    SECURE=false
    MAIL_PORT=587
    MAIL_EMAIL=
    MAIL_PASSWORD=
    HOST=smtp.ethereal.email
    ```

4. Start the backend server:

    ```bash
    node server.js
    ```

### Frontend Setup

1. Navigate to the client directory (Using Vite):

    ```bash
    cd ../client
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the client directory and add the following environment variables:

    ```env
    VITE_API_URL=http://localhost:PORT/api
    VITE_SOCKET_SERVER=http://localhost:PORT
    ```

4. Start the frontend development server:

    ```bash
    npm start
    ```

## Usage

1. Open your browser and navigate to `http://localhost:PORT`.
2. Register a new account.
3. Start exploring the chat app!

## Contributing

Contributions are welcome! Please create a pull request or open an issue to discuss any changes.
