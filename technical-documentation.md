# Medication Management System: Technical Documentation

## 1. Project Overview

### 1.1 Introduction
The Medication Management System is a backend API service designed to help healthcare providers and patients track medication prescriptions, adherence, and treatment progress. The system enables doctors to prescribe medications, patients to log their medication intake, and administrators to manage user accounts.

### 1.2 Purpose and Use Cases
- **For Doctors**: Prescribe medications, monitor patient adherence, and adjust treatments
- **For Patients**: Track prescribed medications, log medication intake, and maintain medical adherence
- **For Nurses**: Assist in medication administration and monitoring
- **For Administrators**: Manage user accounts, roles, and system access

### 1.3 Technologies and Frameworks
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt.js**: Password hashing
- **Joi**: Data validation library
- **Winston**: Logging framework

## 2. Architecture Overview

### 2.1 Project Structure
The project follows an MVC (Model-View-Controller) architecture with the following primary components:
- **Models**: Define data schemas and business logic
- **Controllers**: Handle request processing and response generation
- **Routes**: Define API endpoints and link them to controllers
- **Middlewares**: Provide cross-cutting functionalities like authentication and error handling
- **Validations**: Ensure data integrity through input validation

### 2.2 Module Interaction
```
Client Request → Routes → Middleware (Auth/Validation) → Controllers → Models → Database
               ↑                                          ↓
               └─────────────── Response ────────────────┘
```

### 2.3 Database Design
The system uses MongoDB with the following main collections:
- **Users**: Stores user information with different roles (admin, doctor, nurse, patient)
- **Medications**: Stores prescription details
- **MedicationLogs**: Records patient medication intake history

### 2.4 Authentication Flow
1. User registers or logs in with credentials
2. System validates credentials and issues access and refresh tokens
3. Access token is used for API authorization
4. Refresh token is used to obtain new access tokens when they expire

## 3. Installation and Setup

### 3.1 Prerequisites
- Node.js (v14.x or higher)
- MongoDB (v4.x or higher)
- npm or yarn package manager

### 3.2 Dependencies Installation
```bash
# Clone the repository
git clone [repository-url]
cd medication-management-system

# Install dependencies
npm install
```

### 3.3 Environment Variables
Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/medication-system
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRY=7d
```

### 3.4 Running the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 4. Detailed File and Function Documentation

### 4.1 Models

#### 4.1.1 User.js
Defines the user schema and authentication methods.

**Schema Fields:**
- `name`: User's full name (String, required)
- `email`: User's email address (String, required, unique)
- `password`: Hashed password (String, required, select: false)
- `role`: User's role (String, enum: admin/doctor/nurse/patient)
- `isActive`: Account status (Boolean, default: true)
- `refreshToken`: JWT refresh token (String, select: false)

**Methods:**
- `comparePassword(candidatePassword)`: Verifies password against stored hash
- `generateAccessToken()`: Creates a JWT access token
- `generateRefreshToken()`: Creates a JWT refresh token

#### 4.1.2 Medication.js
Defines the medication prescription schema.

**Schema Fields:**
- `name`: Medication name (String, required)
- `description`: Medication details (String)
- `dosage`: Dosage information (String, required)
- `frequency`: How often to take (String, required)
- `startDate`: When to start taking (Date, required)
- `endDate`: When to stop taking (Date, optional)
- `instructions`: Usage instructions (String)
- `patient`: Reference to User (ObjectId, required)
- `prescribedBy`: Reference to User (ObjectId)
- `isActive`: Whether prescription is active (Boolean, default: true)

#### 4.1.3 MedicationLog.js
Records medication intake events.

**Schema Fields:**
- `medication`: Reference to Medication (ObjectId, required)
- `patient`: Reference to User (ObjectId, required)
- `takenAt`: When medication was taken (Date, default: current time)
- `status`: Intake status (String, enum: taken/missed/postponed)
- `notes`: Additional information (String)
- `recordedBy`: Who recorded this entry (ObjectId, required)

### 4.2 Controllers

#### 4.2.1 authController.js
Handles user authentication operations.

**Functions:**
- `register(req, res)`: Creates a new user account
  - Parameters: req (Request object), res (Response object)
  - Returns: User data and tokens
  
- `login(req, res)`: Authenticates user and provides tokens
  - Parameters: req (Request object), res (Response object)
  - Returns: User data and tokens
  
- `logout(req, res)`: Invalidates user's refresh token
  - Parameters: req (Request object), res (Response object)
  - Returns: Success message
  
- `getProfile(req, res)`: Retrieves current user's profile
  - Parameters: req (Request object), res (Response object)
  - Returns: User data

#### 4.2.2 medicationController.js
Manages medication prescriptions and logs.

**Functions:**
- `createMedication(req, res)`: Creates new medication prescription
  - Parameters: req (Request object), res (Response object)
  - Returns: Created medication
  
- `getMedications(req, res)`: Retrieves medications with filters
  - Parameters: req (Request object), res (Response object)
  - Returns: List of medications
  
- `getMedicationById(req, res)`: Retrieves single medication
  - Parameters: req (Request object), res (Response object)
  - Returns: Medication details
  
- `updateMedication(req, res)`: Updates medication details
  - Parameters: req (Request object), res (Response object)
  - Returns: Updated medication
  
- `deleteMedication(req, res)`: Removes medication record
  - Parameters: req (Request object), res (Response object)
  - Returns: Success message
  
- `logMedicationIntake(req, res)`: Records medication intake
  - Parameters: req (Request object), res (Response object)
  - Returns: Created log entry
  
- `getMedicationLogs(req, res)`: Retrieves medication logs
  - Parameters: req (Request object), res (Response object)
  - Returns: List of medication logs

#### 4.2.3 userController.js
Handles user management operations.

**Functions:**
- `getUsers(req, res)`: Retrieves users with filters
  - Parameters: req (Request object), res (Response object)
  - Returns: List of users
  
- `getUserById(req, res)`: Retrieves single user
  - Parameters: req (Request object), res (Response object)
  - Returns: User details
  
- `updateUserRole(req, res)`: Changes user's role
  - Parameters: req (Request object), res (Response object)
  - Returns: Updated user
  
- `toggleUserStatus(req, res)`: Activates/deactivates user
  - Parameters: req (Request object), res (Response object)
  - Returns: Updated user

### 4.3 Middlewares

#### 4.3.1 authMiddleware.js
Handles authentication and authorization.

**Functions:**
- `authenticate(req, res, next)`: Verifies JWT token
  - Parameters: req (Request object), res (Response object), next (Next middleware)
  - Effects: Attaches user to request object
  
- `authorize(roles)`: Checks user role permissions
  - Parameters: roles (Array or String of allowed roles)
  - Returns: Middleware function that verifies role access
  
- `refreshToken(req, res, next)`: Refreshes access token
  - Parameters: req (Request object), res (Response object), next (Next middleware)
  - Returns: New access and refresh tokens

#### 4.3.2 errorHandler.js
Provides error handling capabilities.

**Classes:**
- `ApiError`: Custom error class for API errors
  - Constructor parameters: statusCode, message, isOperational, stack

**Functions:**
- `errorHandler(err, req, res, next)`: Central error processing
  - Parameters: err (Error), req (Request), res (Response), next (Next middleware)
  - Returns: Error response in consistent format
  
- `asyncHandler(fn)`: Wraps async functions for error handling
  - Parameters: fn (Async function)
  - Returns: Function with error handling

### 4.4 Validations

#### 4.4.1 authValidation.js
Validates authentication requests.

**Functions:**
- `validateRegister(data)`: Validates registration data
  - Parameters: data (Object with user registration details)
  - Returns: Validation result
  
- `validateLogin(data)`: Validates login credentials
  - Parameters: data (Object with email and password)
  - Returns: Validation result

#### 4.4.2 medicationValidation.js
Validates medication data.

**Functions:**
- `validateMedication(data, isUpdate)`: Validates medication data
  - Parameters: data (Medication object), isUpdate (Boolean)
  - Returns: Validation result

### 4.5 Routes

#### 4.5.1 authRoutes.js
Defines authentication endpoints.

**Routes:**
- `POST /api/auth/register`: Create new user
- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/refresh-token`: Refresh access token
- `POST /api/auth/logout`: Logout user
- `GET /api/auth/profile`: Get user profile

#### 4.5.2 medicationRoutes.js
Defines medication management endpoints.

**Routes:**
- `GET /api/medications`: List medications
- `POST /api/medications`: Create medication
- `GET /api/medications/:id`: Get single medication
- `PUT /api/medications/:id`: Update medication
- `DELETE /api/medications/:id`: Delete medication
- `POST /api/medications/:id/log`: Record intake
- `GET /api/medications/:id/logs`: Get medication logs

#### 4.5.3 userRoutes.js
Defines user management endpoints.

**Routes:**
- `GET /api/users`: List users
- `GET /api/users/:id`: Get single user
- `PATCH /api/users/:id/role`: Update user role
- `PATCH /api/users/:id/status`: Toggle user status

## 5. API Documentation

### 5.1 Authentication Endpoints

#### 5.1.1 Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response**: `400 Bad Request`
  ```json
  {
    "success": false,
    "message": "Validation error",
    "errors": [{ "message": "Email is required" }]
  }
  ```

#### 5.1.2 Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response**: `401 Unauthorized`
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

#### 5.1.3 Refresh Token
- **URL**: `/api/auth/refresh-token`
- **Method**: `POST`
- **Authentication**: None
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Response**: `401 Unauthorized`
  ```json
  {
    "success": false,
    "message": "Invalid refresh token"
  }
  ```

#### 5.1.4 Logout User
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Authentication**: Bearer Token
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

#### 5.1.5 Get User Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Authentication**: Bearer Token
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "patient"
    }
  }
  ```

### 5.2 Medication Endpoints

#### 5.2.1 Create Medication
- **URL**: `/api/medications`
- **Method**: `POST`
- **Authentication**: Bearer Token
- **Authorization**: Roles: Doctor, Admin
- **Request Body**:
  ```json
  {
    "name": "Amoxicillin",
    "description": "Antibiotic for bacterial infections",
    "dosage": "500mg",
    "frequency": "3 times a day",
    "startDate": "2023-03-01T00:00:00.000Z",
    "endDate": "2023-03-10T00:00:00.000Z",
    "instructions": "Take with food",
    "patient": "60d21b4667d0d8992e610c85"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "medication": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Amoxicillin",
      "description": "Antibiotic for bacterial infections",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "startDate": "2023-03-01T00:00:00.000Z",
      "endDate": "2023-03-10T00:00:00.000Z",
      "instructions": "Take with food",
      "patient": "60d21b4667d0d8992e610c85",
      "prescribedBy": "60d21b4667d0d8992e610c84",
      "isActive": true
    }
  }
  ```

#### 5.2.2 Get All Medications
- **URL**: `/api/medications`
- **Method**: `GET`
- **Authentication**: Bearer Token
- **Query Parameters**:
  - `patient`: Filter by patient ID
  - `active`: Filter by active status (true/false)
  - `startDate`: Filter by start date
  - `endDate`: Filter by end date
  - `page`: Page number for pagination
  - `limit`: Items per page
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "total": 5,
    "totalPages": 5,
    "currentPage": 1,
    "medications": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Amoxicillin",
        "dosage": "500mg",
        "frequency": "3 times a day",
        "startDate": "2023-03-01T00:00:00.000Z",
        "endDate": "2023-03-10T00:00:00.000Z",
        "patient": {
          "id": "60d21b4667d0d8992e610c85",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "prescribedBy": {
          "id": "60d21b4667d0d8992e610c84",
          "name": "Dr. Smith"
        },
        "isActive": true
      }
    ]
  }
  ```

#### 5.2.3 Get Medication by ID
- **URL**: `/api/medications/:id`
- **Method**: `GET`
- **Authentication**: Bearer Token
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "medication": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Amoxicillin",
      "description": "Antibiotic for bacterial infections",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "startDate": "2023-03-01T00:00:00.000Z",
      "endDate": "2023-03-10T00:00:00.000Z",
      "instructions": "Take with food",
      "patient": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "prescribedBy": {
        "id": "60d21b4667d0d8992e610c84",
        "name": "Dr. Smith"
      },
      "isActive": true
    }
  }
  ```

#### 5.2.4 Log Medication Intake
- **URL**: `/api/medications/:id/log`
- **Method**: `POST`
- **Authentication**: Bearer Token
- **Request Body**:
  ```json
  {
    "status": "taken",
    "notes": "Took with breakfast",
    "takenAt": "2023-03-01T08:00:00.000Z"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "log": {
      "id": "60d21b4667d0d8992e610c87",
      "medication": "60d21b4667d0d8992e610c86",
      "patient": "60d21b4667d0d8992e610c85",
      "status": "taken",
      "notes": "Took with breakfast",
      "takenAt": "2023-03-01T08:00:00.000Z",
      "recordedBy": "60d21b4667d0d8992e610c85"
    }
  }
  ```

### 5.3 User Management Endpoints

#### 5.3.1 Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Authentication**: Bearer Token
- **Authorization**: Admin only
- **Query Parameters**:
  - `role`: Filter by role
  - `active`: Filter by active status (true/false)
  - `search`: Search by name or email
  - `page`: Page number for pagination
  - `limit`: Items per page
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "total": 10,
    "totalPages": 5,
    "currentPage": 1,
    "users": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "patient",
        "isActive": true
      },
      {
        "id": "60d21b4667d0d8992e610c84",
        "name": "Dr. Smith",
        "email": "smith@example.com",
        "role": "doctor",
        "isActive": true
      }
    ]
  }
  ```

#### 5.3.2 Update User Role
- **URL**: `/api/users/:id/role`
- **Method**: `PATCH`
- **Authentication**: Bearer Token
- **Authorization**: Admin only
- **Request Body**:
  ```json
  {
    "role": "doctor"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "doctor",
      "isActive": true
    }
  }
  ```

### 5.4 Authentication and Authorization

All protected routes require an Authentication header with a Bearer token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Role-based access control is implemented as follows:
- **Admin**: Full access to all resources
- **Doctor**: Can create, read, update, and delete medications they prescribe
- **Nurse**: Can read medications and log medication intake
- **Patient**: Can read their own medications and log their intake

### 5.5 Error Handling

The API uses consistent error response formats:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authentication valid but insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## 6. Best Practices and Code Standards

### 6.1 Naming Conventions
- **Files**: Use camelCase for files (e.g., `userController.js`)
- **Folders**: Use lowercase (e.g., `models`, `controllers`)
- **Variables/Functions**: Use camelCase (e.g., `getUserById`)
- **Classes**: Use PascalCase (e.g., `ApiError`)
- **Constants**: Use UPPERCASE_WITH_UNDERSCORES (e.g., `ROLES.ADMIN`)

### 6.2 Security Considerations
- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- Refresh tokens provide secure re-authentication without credentials
- Role-based access control limits resource access
- Input validation prevents malicious data injection
- Error messages don't expose sensitive information in production

### 6.3 Performance Optimizations
- Pagination implemented for list endpoints
- Database indexing for frequently queried fields
- Async/await used for non-blocking I/O operations
- Middleware approach for common functionalities
- Error logging for debugging and monitoring

### 6.4 Code Organization
- Separation of concerns with MVC pattern
- Centralized error handling
- Route grouping by resource type
- Validation separated from business logic
- Middleware for cross-cutting concerns

## 7. Deployment Guide

### 7.1 Environment Setup
1. Set up a MongoDB database (Atlas or self-hosted)
2. Configure environment variables for production

### 7.2 Production Environment Variables
```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medication-system
JWT_SECRET_KEY=your_strong_production_jwt_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_strong_production_refresh_secret
JWT_REFRESH_EXPIRY=7d
```

### 7.3 Deployment Options

#### 7.3.1 Container Deployment (Docker)
```Dockerfile
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t medication-system .
docker run -p 8080:8080 --env-file .env.production medication-system
```

#### 7.3.2 Cloud Platform Deployment

**Heroku:**
```bash
# Add Procfile
echo "web: npm start" > Procfile

# Deploy
heroku create medication-system
heroku config:set $(cat .env.production)
git push heroku main
```

**AWS Elastic Beanstalk:**
1. Create `Procfile`:
   ```
   web: npm start
   ```
2. Create `.ebextensions/nodecommand.config`:
   ```yaml
   option_settings:
     aws:elasticbeanstalk:container:nodejs:
       NodeCommand: "npm start"
   ```
3. Deploy using EB CLI:
   ```bash
   eb init
   eb create production-environment
   eb setenv $(cat .env.production)
   eb deploy
   ```

### 7.4 Database Migration
For production deployment, ensure database migration tools are in place:
```bash
# Using mongoose-data-seeder
npm install mongoose-data-seeder
node scripts/seed.js --environment=production
```

### 7.5 Monitoring and Logging
- Configure Winston to log to external services in production
- Use PM2 for process management:
  ```bash
  npm install -g pm2
  pm2 start npm --name "medication-system" -- start
  ```

## 8. Troubleshooting & FAQs

### 8.1 Common Issues

#### 8.1.1 Authentication Issues
**Problem**: JWT token validation fails with 401 errors.
**Solution**: 
- Ensure clocks are synchronized (JWT validation is time-sensitive)
- Verify correct JWT secret is being used
- Check token expiration time

#### 8.1.2 Database Connection Issues
**Problem**: MongoDB connection fails.
**Solution**:
- Check connection string format
- Verify network access to MongoDB server
- Ensure MongoDB service is running
- Check IP whitelisting if using Atlas

#### 8.1.3 Permission Errors
**Problem**: User gets 403 Forbidden when accessing an endpoint.
**Solution**:
- Verify user role matches required permissions
- Check if user is trying to access another user's data
- Examine authorization middleware logic

### 8.2 FAQs

#### 8.2.1 How do I add a new role to the system?
Update the `ROLES` object in the `User.js` model to include the new role, then update any authorization middleware logic that references roles.

#### 8.2.2 How can I extend the medication schema with new fields?
Update the `Medication.js` model with new fields, then update the corresponding validation in `medicationValidation.js`.

#### 8.2.3 How do I change the token expiration time?
Update the `JWT_ACCESS_EXPIRY` and `JWT_REFRESH_EXPIRY` environment variables.

#### 8.2.4 How can I implement password reset functionality?
1. Create a new model for password reset tokens
2. Add controller methods to generate tokens and process resets
3. Create email sending functionality
4. Add new routes in authRoutes.js

#### 8.2.5 How do I handle file uploads for prescriptions?
1. Install multer for file upload handling
2. Create storage configuration
3. Add middleware to routes
4. Update models to store file references
5. Handle file validation and security
