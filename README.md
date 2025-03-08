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

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\app.js
// ...existing code...
```

### `package.json`

Contains the project metadata and dependencies.

```json
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\package.json
// ...existing code...
```

### `src/models/User.js`

Defines the User model and schema, including methods for password hashing and JWT token generation.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\models\User.js
// ...existing code...
```

### `src/models/Medication.js`

Defines the Medication model and schema.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\models\Medication.js
// ...existing code...
```

### `src/models/MedicationLog.js`

Defines the MedicationLog model and schema.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\models\MedicationLog.js
// ...existing code...
```

### `src/controllers/authController.js`

Handles user authentication-related operations such as register, login, logout, and profile retrieval.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\controllers\authController.js
// ...existing code...
```

### `src/controllers/userController.js`

Handles user management operations such as retrieving users, updating roles, and toggling user status.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\controllers\userController.js
// ...existing code...
```

### `src/controllers/medicationController.js`

Handles medication management operations such as creating, retrieving, updating, and deleting medications, as well as logging medication intake.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\controllers\medicationController.js
// ...existing code...
```

### `src/routes/authRoutes.js`

Defines the routes for authentication-related endpoints.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\routes\authRoutes.js
// ...existing code...
```

### `src/routes/userRoutes.js`

Defines the routes for user management-related endpoints.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\routes\userRoutes.js
// ...existing code...
```

### `src/routes/medicationRoutes.js`

Defines the routes for medication management-related endpoints.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\routes\medicationRoutes.js
// ...existing code...
```

### `src/routes/index.js`

Combines all the routes and registers them with the Express app.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\routes\index.js
// ...existing code...
```

### `src/middlewares/authMiddleware.js`

Provides authentication and authorization middlewares to protect routes.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\middlewares\authMiddleware.js
// ...existing code...
```

### `src/middlewares/errorHandler.js`

Handles errors and logs them using Winston.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\middlewares\errorHanlder.js
// ...existing code...
```

### `src/validations/authValidation.js`

Defines validation schemas for authentication-related data using Joi.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\validations\authValidation.js
// ...existing code...
```

### `src/validations/medicationValidation.js`

Defines validation schemas for medication-related data using Joi.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\src\validations\medicationValidation.js
// ...existing code...
```

### `.env`

Contains environment variables for the application.

```properties
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\.env
// ...existing code...
```

### `.eslintrc.js`

Configuration file for ESLint to enforce coding standards.

```javascript
// filepath: c:\Users\DELL\OneDrive\Desktop\medication_tracking_app\backend\.eslintrc.js
// ...existing code...
```

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