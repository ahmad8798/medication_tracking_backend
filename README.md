# Medication Tracking App - Backend

## Overview

This project is the backend for a medication tracking application. It provides APIs for user authentication, medication management, and logging medication intake. The backend is built using Node.js, Express, and MongoDB.

## Architecture

The application follows a typical MVC (Model-View-Controller) architecture:

- **Models**: Define the data structure and interact with the database.
- **Controllers**: Handle the business logic and process requests.
- **Routes**: Define the endpoints and map them to controller functions.
- **Middlewares**: Provide reusable functions to handle requests and responses.

### Detailed Architecture

1. **Models**: 
   - Located in the `src/models` directory.
   - Define the schema for the application's data using Mongoose.
   - Include methods for data manipulation and validation.

2. **Controllers**: 
   - Located in the `src/controllers` directory.
   - Contain the business logic for handling requests and responses.
   - Interact with models to perform CRUD operations and other business processes.

3. **Routes**: 
   - Located in the `src/routes` directory.
   - Define the API endpoints and map them to corresponding controller functions.
   - Use Express Router to organize routes.

4. **Middlewares**: 
   - Located in the `src/middlewares` directory.
   - Provide reusable functions for request processing, such as authentication, authorization, and error handling.

5. **Validations**: 
   - Located in the `src/validations` directory.
   - Define schemas for validating request data using Joi.

## Functionality

- **User Authentication**: Register, login, logout, and profile management.
- **Medication Management**: CRUD operations for medications.
- **Medication Logs**: Log and retrieve medication intake records.
- **Role-Based Access Control**: Different access levels for admin, doctor, nurse, and patient roles.

## Environment Variables

The application uses the following environment variables:

- `MONGODB_URI`: MongoDB connection string.
- `PORT`: Port number for the server.
- `JWT_SECRET_KEY`: Secret key for JWT access tokens.
- `JWT_REFRESH_SECRET`: Secret key for JWT refresh tokens.

## File Structure

### `app.js`

The main entry point of the application. It sets up the Express app, middlewares, routes, and database connection.

### `package.json`

Contains the project metadata and dependencies.

### Key Files

- **Models**:
  - `src/models/User.js` - User model and schema with password hashing and JWT generation
  - `src/models/Medication.js` - Medication model and schema
  - `src/models/MedicationLog.js` - MedicationLog model and schema

- **Controllers**:
  - `src/controllers/authController.js` - Authentication operations
  - `src/controllers/userController.js` - User management operations
  - `src/controllers/medicationController.js` - Medication and log management

- **Routes**:
  - `src/routes/authRoutes.js` - Authentication endpoints
  - `src/routes/userRoutes.js` - User management endpoints
  - `src/routes/medicationRoutes.js` - Medication management endpoints
  - `src/routes/index.js` - Combines all routes

- **Middlewares**:
  - `src/middlewares/authMiddleware.js` - Authentication and authorization
  - `src/middlewares/errorHandler.js` - Error handling and logging

- **Validations**:
  - `src/validations/authValidation.js` - Authentication data validation
  - `src/validations/medicationValidation.js` - Medication data validation

- **Config**:
  - `.env` - Environment variables
  - `.eslintrc.js` - ESLint configuration

## Running the Application

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file with the required environment variables.

3. Start the server:
   ```sh
   npm start
   ```

4. For development, use:
   ```sh
   npm run dev
   ```

## Testing

Run tests using Jest:
```sh
npm test
```

## License

This project is licensed under the MIT License.