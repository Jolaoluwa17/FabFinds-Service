# FabFinds Backend

Welcome to the FabFinds backend! This project serves as the backend for the FabFinds e-commerce website, providing RESTful APIs to support the platform's functionality. The backend is built using **Node.js**, **Express**, and **MongoDB**.

## Features

- **User Authentication**: Secure user registration and login functionality.
- **Product Management**: Create, read, update, and delete (CRUD) operations for product listings.
- **Category Management**: Organize products into various categories.
- **Order Processing**: Manage customer orders and track their status.
- **Search Functionality**: Allow users to search for products based on keywords or filters.
- **Responsive API**: Designed to handle requests efficiently and return JSON responses.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web application framework for Node.js, providing a robust set of features.
- **MongoDB**: NoSQL database for storing data in a flexible, JSON-like format.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For secure user authentication.

## Installation

To run this project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/fabfinds-backend.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Create a .env file in the root directory and add your environment variables (example)**:
   ```plaintext
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fabfinds
   JWT_SECRET=your_jwt_secret
   ```
4. **Start the application**:
   ```bash
   npm run dev
   ```
The backend server should now be running on `http://localhost:5000`.

## API Documentation
The API documentation is generated using Swagger. Once the server is running, you can access the Swagger UI at:
```bash
http://localhost:5000/api-docs
```
This interface provides detailed information about each endpoint, including request and response formats.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
