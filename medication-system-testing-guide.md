# Medication Management System: Testing & Access Control Guide

## 1. Access Control Matrix

### 1.1 User Roles Overview

| Role | Description | Access Level |
|------|-------------|--------------|
| **Admin** | System administrators | Full system access |
| **Doctor** | Healthcare providers who prescribe medications | Create and manage prescriptions, view patient data |
| **Nurse** | Healthcare staff who assist with medication administration | View medications, log medication intake |
| **Patient** | End users who receive and take medications | View own medications, log own medication intake |

### 1.2 Detailed Access Rights by Resource

#### User Management

| Action | Admin | Doctor | Nurse | Patient |
|--------|-------|--------|-------|---------|
| View all users | ✅ | ❌ | ❌ | ❌ |
| View user details | ✅ | ❌ | ❌ | ❌ |
| Create user accounts | ✅ | ❌ | ❌ | ❌ |
| Update user roles | ✅ | ❌ | ❌ | ❌ |
| Activate/deactivate users | ✅ | ❌ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ | ✅ |

#### Medication Management

| Action | Admin | Doctor | Nurse | Patient |
|--------|-------|--------|-------|---------|
| Create medication prescriptions | ✅ | ✅ | ❌ | ❌ |
| View all medications | ✅ | ❌ | ❌ | ❌ |
| View medications they prescribed | ✅ | ✅ | ❌ | ❌ |
| View assigned patient medications | ✅ | ✅ | ✅ | ❌ |
| View own medications | ✅ | ✅ | ✅ | ✅ |
| Update any medication | ✅ | ❌ | ❌ | ❌ |
| Update medications they prescribed | ✅ | ✅ | ❌ | ❌ |
| Delete any medication | ✅ | ❌ | ❌ | ❌ |
| Delete medications they prescribed | ✅ | ✅ | ❌ | ❌ |

#### Medication Logs

| Action | Admin | Doctor | Nurse | Patient |
|--------|-------|--------|-------|---------|
| Log any patient's medication intake | ✅ | ✅ | ✅ | ❌ |
| Log own medication intake | ✅ | ✅ | ✅ | ✅ |
| View all medication logs | ✅ | ❌ | ❌ | ❌ |
| View logs for medications they prescribed | ✅ | ✅ | ❌ | ❌ |
| View logs for assigned patients | ✅ | ✅ | ✅ | ❌ |
| View own medication logs | ✅ | ✅ | ✅ | ✅ |

## 2. Authentication Testing Scenarios

### 2.1 Registration Testing

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| REG-001 | Valid user registration | 1. POST to `/api/auth/register` with valid details<br>2. Verify response | 201 Created with user details and tokens |
| REG-002 | Registration with existing email | 1. Register a user<br>2. Try to register again with same email | 400 Bad Request with appropriate error message |
| REG-003 | Registration with invalid data | 1. Submit registration with invalid email format<br>2. Submit registration with short password<br>3. Submit registration with missing required fields | 400 Bad Request with specific validation errors |
| REG-004 | Registration with invalid role | 1. Submit registration with non-existent role | 400 Bad Request with role validation error |

### 2.2 Login Testing

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| LOGIN-001 | Valid user login | 1. POST to `/api/auth/login` with valid credentials | 200 OK with user details and tokens |
| LOGIN-002 | Login with invalid email | 1. POST to `/api/auth/login` with non-existent email | 401 Unauthorized with generic error message |
| LOGIN-003 | Login with incorrect password | 1. POST to `/api/auth/login` with wrong password | 401 Unauthorized with generic error message |
| LOGIN-004 | Login with deactivated account | 1. Deactivate a user account (as admin)<br>2. Try to login with that account | 401 Unauthorized with account inactive message |

### 2.3 Token Management Testing

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| TOKEN-001 | Access protected route with valid token | 1. Login to get token<br>2. Access protected endpoint with token | 200 OK with requested resource |
| TOKEN-002 | Access protected route with expired token | 1. Use an expired access token<br>2. Try to access protected endpoint | 401 Unauthorized with token expired message |
| TOKEN-003 | Refresh token flow | 1. Login to get tokens<br>2. Use refresh token to get new access token | 200 OK with new access and refresh tokens |
| TOKEN-004 | Logout functionality | 1. Login to get tokens<br>2. Logout using token<br>3. Try to use the same refresh token | 401 Unauthorized after trying to use invalidated token |

## 3. User Management Testing Scenarios

### 3.1 User Listing and Filtering

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| USER-001 | List all users as admin | 1. Login as admin<br>2. GET to `/api/users` | 200 OK with list of all users |
| USER-002 | List users with role filter | 1. Login as admin<br>2. GET to `/api/users?role=doctor` | 200 OK with list of doctors only |
| USER-003 | List users with active status filter | 1. Login as admin<br>2. GET to `/api/users?active=true` | 200 OK with list of active users only |
| USER-004 | Access user list as non-admin | 1. Login as doctor/nurse/patient<br>2. GET to `/api/users` | 403 Forbidden |
| USER-005 | Pagination of user results | 1. Login as admin<br>2. GET to `/api/users?page=1&limit=10` | 200 OK with paginated results and pagination metadata |

### 3.2 User Role Management

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| ROLE-001 | Update user role as admin | 1. Login as admin<br>2. PATCH to `/api/users/:id/role` with new role | 200 OK with updated user details |
| ROLE-002 | Update to invalid role | 1. Login as admin<br>2. PATCH to `/api/users/:id/role` with non-existent role | 400 Bad Request with role validation error |
| ROLE-003 | Update role as non-admin | 1. Login as doctor/nurse/patient<br>2. PATCH to `/api/users/:id/role` | 403 Forbidden |

### 3.3 User Status Management

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| STATUS-001 | Deactivate user as admin | 1. Login as admin<br>2. PATCH to `/api/users/:id/status` with `isActive: false` | 200 OK with updated user status |
| STATUS-002 | Reactivate user as admin | 1. Login as admin<br>2. PATCH to `/api/users/:id/status` with `isActive: true` | 200 OK with updated user status |
| STATUS-003 | Toggle user status as non-admin | 1. Login as doctor/nurse/patient<br>2. PATCH to `/api/users/:id/status` | 403 Forbidden |

## 4. Medication Management Testing Scenarios

### 4.1 Prescription Creation

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| MED-001 | Create medication as doctor | 1. Login as doctor<br>2. POST to `/api/medications` with valid medication data | 201 Created with medication details |
| MED-002 | Create medication as admin | 1. Login as admin<br>2. POST to `/api/medications` with valid medication data | 201 Created with medication details |
| MED-003 | Create medication with invalid data | 1. Login as doctor<br>2. POST to `/api/medications` with missing required fields | 400 Bad Request with validation errors |
| MED-004 | Create medication as nurse | 1. Login as nurse<br>2. POST to `/api/medications` | 403 Forbidden |
| MED-005 | Create medication as patient | 1. Login as patient<br>2. POST to `/api/medications` | 403 Forbidden |

### 4.2 Medication Listing and Filtering

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| MEDLIST-001 | View all medications as admin | 1. Login as admin<br>2. GET to `/api/medications` | 200 OK with all medications |
| MEDLIST-002 | View prescribed medications as doctor | 1. Login as doctor<br>2. GET to `/api/medications` | 200 OK with medications prescribed by this doctor |
| MEDLIST-003 | View assigned medications as nurse | 1. Login as nurse<br>2. GET to `/api/medications` | 200 OK with medications for assigned patients |
| MEDLIST-004 | View own medications as patient | 1. Login as patient<br>2. GET to `/api/medications` | 200 OK with medications prescribed to this patient |
| MEDLIST-005 | Filter medications by active status | 1. Login as appropriate role<br>2. GET to `/api/medications?active=true` | 200 OK with active medications only |
| MEDLIST-006 | Filter medications by date range | 1. Login as appropriate role<br>2. GET to `/api/medications?startDate=2023-01-01&endDate=2023-12-31` | 200 OK with medications in date range |

### 4.3 Medication Updates

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| MEDUPD-001 | Update medication as prescribing doctor | 1. Login as prescribing doctor<br>2. PUT to `/api/medications/:id` with updated data | 200 OK with updated medication |
| MEDUPD-002 | Update medication as admin | 1. Login as admin<br>2. PUT to `/api/medications/:id` with updated data | 200 OK with updated medication |
| MEDUPD-003 | Update medication as non-prescribing doctor | 1. Login as doctor who didn't prescribe this medication<br>2. PUT to `/api/medications/:id` | 403 Forbidden |
| MEDUPD-004 | Update medication as nurse or patient | 1. Login as nurse or patient<br>2. PUT to `/api/medications/:id` | 403 Forbidden |

### 4.4 Medication Deletion

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| MEDDEL-001 | Delete medication as prescribing doctor | 1. Login as prescribing doctor<br>2. DELETE to `/api/medications/:id` | 200 OK with success message |
| MEDDEL-002 | Delete medication as admin | 1. Login as admin<br>2. DELETE to `/api/medications/:id` | 200 OK with success message |
| MEDDEL-003 | Delete medication as non-prescribing doctor | 1. Login as doctor who didn't prescribe this medication<br>2. DELETE to `/api/medications/:id` | 403 Forbidden |
| MEDDEL-004 | Delete medication as nurse or patient | 1. Login as nurse or patient<br>2. DELETE to `/api/medications/:id` | 403 Forbidden |

## 5. Medication Log Testing Scenarios

### 5.1 Log Creation

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| LOG-001 | Log medication intake as patient (own) | 1. Login as patient<br>2. POST to `/api/medications/:id/log` with valid log data | 201 Created with log details |
| LOG-002 | Log medication intake as nurse | 1. Login as nurse<br>2. POST to `/api/medications/:id/log` for assigned patient | 201 Created with log details |
| LOG-003 | Log medication intake as doctor | 1. Login as doctor<br>2. POST to `/api/medications/:id/log` for their patient | 201 Created with log details |
| LOG-004 | Log medication intake as admin | 1. Login as admin<br>2. POST to `/api/medications/:id/log` for any patient | 201 Created with log details |
| LOG-005 | Log medication intake for non-assigned patient | 1. Login as nurse<br>2. POST to `/api/medications/:id/log` for non-assigned patient | 403 Forbidden |
| LOG-006 | Log with invalid data | 1. Login as appropriate role<br>2. POST to `/api/medications/:id/log` with invalid status | 400 Bad Request with validation errors |

### 5.2 Log Retrieval

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| LOGGET-001 | View own medication logs as patient | 1. Login as patient<br>2. GET to `/api/medications/:id/logs` | 200 OK with patient's logs |
| LOGGET-002 | View patient logs as treating doctor | 1. Login as doctor<br>2. GET to `/api/medications/:id/logs` for prescribed medication | 200 OK with patient's logs |
| LOGGET-003 | View patient logs as assigned nurse | 1. Login as nurse<br>2. GET to `/api/medications/:id/logs` for assigned patient | 200 OK with patient's logs |
| LOGGET-004 | View any logs as admin | 1. Login as admin<br>2. GET to `/api/medications/:id/logs` for any medication | 200 OK with medication logs |
| LOGGET-005 | View logs for non-assigned patient | 1. Login as nurse<br>2. GET to `/api/medications/:id/logs` for non-assigned patient | 403 Forbidden |

## 6. Edge Cases and Boundary Testing

### 6.1 Concurrent Access

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| CONC-001 | Concurrent medication updates | 1. Two users (admin and doctor) attempt to update the same medication simultaneously | Last update should be applied without data corruption |
| CONC-002 | Concurrent user role updates | 1. Two admins try to change a user's role simultaneously | Last update should be applied without data corruption |

### 6.2 Data Validation Edge Cases

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| VAL-001 | Medication with past end date | 1. Create medication with end date in the past | 400 Bad Request with date validation error |
| VAL-002 | End date before start date | 1. Create medication with end date before start date | 400 Bad Request with date validation error |
| VAL-003 | Very long text inputs | 1. Submit medication with extremely long text in fields | System should handle or reject appropriately |

### 6.3 Security Testing

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| SEC-001 | SQL injection attempts | 1. Submit data with SQL injection patterns | Request should be rejected or sanitized |
| SEC-002 | XSS attack attempts | 1. Submit data with script tags and other XSS vectors | Input should be sanitized or rejected |
| SEC-003 | CSRF protection | 1. Try to submit requests without proper tokens/headers | 403 Forbidden |
| SEC-004 | Rate limiting | 1. Make many rapid requests to authentication endpoints | After threshold, requests should be rate-limited |

## 7. Mobile App Integration Testing Scenarios

### 7.1 Session Management

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| MOB-001 | Token persistence across app restarts | 1. Login on mobile app<br>2. Restart app<br>3. Verify session maintained | User should remain logged in |
| MOB-002 | Auto refresh of expired token | 1. Login on mobile<br>2. Wait for access token to expire<br>3. Make new request | New access token should be obtained automatically using refresh token |
| MOB-003 | Logout across all devices | 1. Login on multiple devices<br>2. Logout from one device<br>3. Try to use refresh token on other device | Other device session should be invalidated |

### 7.2 Offline Functionality

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| OFF-001 | Medication log creation offline | 1. Login<br>2. Disconnect from network<br>3. Create medication log<br>4. Reconnect | Log should be synchronized when connection restored |
| OFF-002 | View cached medications offline | 1. View medications while online<br>2. Disconnect from network<br>3. Try to view medications again | Previously loaded medications should be viewable |

## 8. System Administration Testing Scenarios

### 8.1 System Monitoring

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| ADMIN-001 | Error log monitoring | 1. Trigger various error conditions<br>2. Check if errors are properly logged | Errors should be captured with appropriate detail level |
| ADMIN-002 | Performance monitoring | 1. Generate significant system load<br>2. Monitor system performance | System should log performance metrics |

### 8.2 Data Management

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| DATA-001 | Data export functionality | 1. Login as admin<br>2. Export user or medication data | Data should be exported in expected format |
| DATA-002 | Data backup procedures | 1. Trigger database backup<br>2. Verify backup integrity | Backup should be created successfully |

## 9. Compliance Testing Scenarios

### 9.1 Privacy and Patient Data

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| COMP-001 | Data access audit logging | 1. Access patient data with different roles<br>2. Check audit logs | All data access should be logged with user, timestamp, and action |
| COMP-002 | Sensitive data masking | 1. View patient data in different contexts<br>2. Check if sensitive data is appropriately masked | Sensitive data should be masked when appropriate |

### 9.2 Regulatory Compliance

| Test Case ID | Description | Test Steps | Expected Result |
|--------------|-------------|------------|----------------|
| REG-001 | Patient consent recording | 1. Set up patient account<br>2. Record consent information<br>3. Verify retrieval | Consent information should be properly recorded and retrievable |
| REG-002 | Data retention policies | 1. Test deletion of old records<br>2. Verify data retention policies are enforced | Data should be retained or deleted according to configured policies |

## 10. Summary: Access Control Implementation

### 10.1 Authorization Middleware

Based on the documentation, authorization is implemented through the `authorize(roles)` middleware function in `authMiddleware.js`. This middleware:

1. Takes an array of allowed roles
2. Checks if the authenticated user's role is in the allowed roles
3. Returns 403 Forbidden if the user doesn't have sufficient permissions
4. Calls next() to proceed if authorization passes

### 10.2 Access Control Approach

The system implements Role-Based Access Control (RBAC) with four distinct roles:
1. **Admin**: Full access with system management capabilities
2. **Doctor**: Create and manage prescriptions, view own patients
3. **Nurse**: View medications and record intake
4. **Patient**: View own medications and record own intake

### 10.3 Request Flow with Access Control

1. Client makes request with JWT Bearer token
2. `authenticate` middleware verifies the token and attaches user to request
3. `authorize([roles])` middleware checks if user role is allowed
4. Controller methods apply additional business logic for object-level permissions
5. Response is sent back to client

### 10.4 Data Isolation

The system ensures data isolation by:
1. Filtering medication queries by user relationships (doctor's prescriptions, patient's medications)
2. Checking ownership or relationship before allowing updates or deletions
3. Ensuring patients can only see their own data
4. Associating every medication log with specific user contexts (patient and recorder)
