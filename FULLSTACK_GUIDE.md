# Contact Management System - Full Stack Guide

A complete full-stack web application for managing contacts, built with Java Spring Boot backend and React.js frontend.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                          │
│              React.js + Material-UI + Tailwind              │
│                   Port: 3000                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ HTTP/REST API
                      │ (Axios)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   API Layer                                 │
│           Spring Boot REST Controllers                      │
│                   Port: 8080                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ JWT Authentication
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Business Logic                              │
│              Spring Boot Services                           │
│              + Security Layer                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ JPA/Hibernate
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Data Layer                                │
│              PostgreSQL Database                            │
│                   Port: 5432                                │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start - Run Both Applications

### Step 1: Start PostgreSQL Database

```bash
sudo systemctl start postgresql
```

Verify database exists:
```bash
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname='contact_management';"
```

### Step 2: Start Backend (Terminal 1)

```bash
# From project root
mvn spring-boot:run
```

Wait for the message:
```
Started CircleApplication in X.XXX seconds
```

Backend will be available at: `http://localhost:8080`

### Step 3: Start Frontend (Terminal 2)

```bash
# From project root
cd frontend
npm install  # First time only
npm start
```

Browser will automatically open at: `http://localhost:3000`

### Step 4: Test the Application

1. Navigate to `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Fill in your details and register
4. Start adding contacts!

## Application Screenshots & Features

### 1. Login Page
**URL:** `http://localhost:3000/login`

**Features:**
- Clean, modern login form
- Email or phone number login
- Password visibility toggle
- Link to registration page
- Gradient background
- Form validation

**Test Credentials (after registration):**
- Username: `john@example.com`
- Password: `password123`

---

### 2. Registration Page
**URL:** `http://localhost:3000/register`

**Features:**
- User-friendly registration form
- First name and last name fields
- Email or phone number (at least one required)
- Password confirmation
- Automatic login after registration
- Real-time validation
- Error handling

**Fields:**
- First Name (required)
- Last Name (required)
- Email (required if no phone)
- Phone Number (required if no email)
- Password (min 6 characters)
- Confirm Password

---

### 3. Contacts Dashboard
**URL:** `http://localhost:3000/contacts`

**Features:**
- Card-based contact display
- Search bar at the top
- Floating action button for quick add
- Edit and delete buttons on each card
- Pagination controls
- Responsive grid layout (1-3 columns)
- Empty state for no contacts
- Loading indicators

**Contact Card Shows:**
- Avatar with initials
- Full name
- Job title
- Email addresses (with type badges)
- Phone numbers (with type badges)
- Quick action buttons

**Actions:**
- Search by first or last name
- Create new contact
- Edit existing contact
- Delete contact (with confirmation)
- Navigate pages

---

### 4. Create/Edit Contact Modal
**Triggered by:** "+" button or Edit icon

**Features:**
- Large, centered modal dialog
- Dynamic form fields
- Add/remove email addresses
- Add/remove phone numbers
- Type selection for each entry
- Form validation
- Cancel/Save buttons

**Fields:**
- First Name (required)
- Last Name (required)
- Title (optional)
- Emails (multiple, with type)
  - Types: WORK, PERSONAL, OTHER
- Phones (multiple, with type)
  - Types: WORK, HOME, PERSONAL, OTHER

---

### 5. Delete Confirmation Dialog
**Triggered by:** Trash icon on contact card

**Features:**
- Warning icon
- Contact name display
- "This action cannot be undone" message
- Cancel button
- Delete button (red)
- Prevents accidental deletion

---

### 6. User Profile Page
**URL:** `http://localhost:3000/profile`

**Features:**
- Large profile header with gradient
- Avatar with initials
- User information display
- Contact information section
- Account details section
- Change password button
- Beautiful card layout

**Information Shown:**
- Full name
- Account status (Active/Inactive)
- Email address
- Phone number
- Member since date
- Last updated date

---

### 7. Change Password Modal
**Triggered by:** "Change Password" button on profile

**Features:**
- Secure password change form
- Current password field
- New password field
- Confirm password field
- Password visibility toggles
- Validation
- Success message

---

### 8. Navigation & Layout

**App Bar Features:**
- App logo/name "Circle"
- Menu button
- User avatar

**Side Drawer Features:**
- User info header
- Contacts menu item
- Profile menu item
- Logout button
- Active route highlighting

## API Integration Details

### Authentication Flow

1. **User Registration:**
```javascript
POST /api/auth/register
Body: {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phoneNumber: "+1234567890",
  password: "password123"
}
Response: {
  success: true,
  message: "User registered successfully",
  data: {
    token: "eyJhbGc...",
    type: "Bearer",
    user: { ... }
  }
}
```

2. **User Login:**
```javascript
POST /api/auth/login
Body: {
  username: "john@example.com",
  password: "password123"
}
Response: {
  success: true,
  message: "Login successful",
  data: {
    token: "eyJhbGc...",
    type: "Bearer",
    user: { ... }
  }
}
```

3. **Token Storage:**
- Stored in localStorage
- Automatically added to all requests
- Removed on logout or 401 error

### Contact Operations

1. **Create Contact:**
```javascript
POST /api/contacts
Headers: { Authorization: "Bearer <token>" }
Body: {
  firstName: "Jane",
  lastName: "Smith",
  title: "Software Engineer",
  emails: [
    { email: "jane@work.com", type: "WORK" }
  ],
  phones: [
    { phoneNumber: "+1234567890", type: "WORK" }
  ]
}
```

2. **Get All Contacts:**
```javascript
GET /api/contacts?page=0&size=9&sortBy=firstName&sortDir=ASC
Headers: { Authorization: "Bearer <token>" }
```

3. **Search Contacts:**
```javascript
GET /api/contacts/search?query=jane&page=0&size=9
Headers: { Authorization: "Bearer <token>" }
```

4. **Update Contact:**
```javascript
PUT /api/contacts/1
Headers: { Authorization: "Bearer <token>" }
Body: { ... updated fields ... }
```

5. **Delete Contact:**
```javascript
DELETE /api/contacts/1
Headers: { Authorization: "Bearer <token>" }
```

## Technology Stack Summary

### Backend
- **Java 25**
- **Spring Boot 4.0.1**
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database access
- **PostgreSQL** - Database
- **BCrypt** - Password hashing
- **Lombok** - Code generation
- **Slf4j** - Logging

### Frontend
- **React.js 18** - UI framework
- **Material-UI 5** - Component library
- **Tailwind CSS 3** - Utility CSS
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Router 6** - Navigation

### Development Tools
- **Maven** - Backend build tool
- **npm** - Frontend package manager
- **Git** - Version control

## Project File Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/susa/circle/
│   │   │   │   ├── config/          # Security config
│   │   │   │   ├── controller/      # REST endpoints
│   │   │   │   ├── dto/             # Data transfer objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data access
│   │   │   │   ├── security/        # JWT implementation
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.yml  # Configuration
│   │   └── test/                    # Unit tests
│   └── pom.xml
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/              # Reusable components
    │   ├── context/                 # Global state
    │   ├── pages/                   # Route pages
    │   ├── services/                # API client
    │   ├── App.js                   # Main app
    │   └── index.js                 # Entry point
    ├── package.json
    └── tailwind.config.js
```

## Development Workflow

### Backend Development

1. **Make Changes:**
```bash
# Edit Java files in src/main/java
```

2. **Run Tests:**
```bash
mvn test
```

3. **Restart Application:**
```bash
mvn spring-boot:run
```

### Frontend Development

1. **Make Changes:**
```bash
# Edit files in frontend/src
```

2. **Hot Reload:**
- Changes automatically reload
- No restart needed

3. **Build for Production:**
```bash
npm run build
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20) UNIQUE,
  password VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  title VARCHAR(100),
  user_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Contact Emails Table
```sql
CREATE TABLE contact_emails (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  contact_id BIGINT REFERENCES contacts(id)
);
```

### Contact Phones Table
```sql
CREATE TABLE contact_phones (
  id BIGSERIAL PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  type VARCHAR(20) NOT NULL,
  contact_id BIGINT REFERENCES contacts(id)
);
```

## Security Implementation

### Backend Security
- JWT token-based authentication
- BCrypt password hashing
- CORS configuration
- Protected endpoints
- Global exception handling

### Frontend Security
- Token storage in localStorage
- Automatic token injection
- Protected routes
- Token expiration handling
- XSS prevention (React)

## Testing Guide

### Backend Testing

Run all tests:
```bash
mvn test
```

Test coverage includes:
- Controller tests
- Service tests
- Repository tests
- Security tests

### Frontend Manual Testing

1. **Authentication:**
   - Register new user
   - Login with email
   - Login with phone
   - Invalid credentials
   - Token expiration

2. **Contact CRUD:**
   - Create contact
   - View contacts
   - Update contact
   - Delete contact
   - Search contacts
   - Pagination

3. **Profile:**
   - View profile
   - Change password
   - Logout

## Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

**Problem:** Database connection failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql
# Start PostgreSQL
sudo systemctl start postgresql
```

### Frontend Issues

**Problem:** Cannot connect to backend
- Verify backend is running on port 8080
- Check browser console for errors
- Verify CORS settings

**Problem:** npm install fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Considerations

### Backend
- Connection pooling configured
- Lazy loading for entities
- Pagination implemented
- Indexed database columns

### Frontend
- Pagination limits data load
- Efficient re-renders
- Optimized bundle size
- Code splitting ready

## Production Deployment

### Backend
```bash
# Build JAR file
mvn clean package
# Run JAR
java -jar target/circle-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
# Build production bundle
npm run build
# Serve with static server
serve -s build -p 3000
```

## Environment Variables

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/contact_management
    username: postgres
    password: postgres
jwt:
  secret: your-secret-key
  expiration: 86400000
```

### Frontend (optional .env)
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Future Enhancements

### Planned Features
1. Export contacts to CSV/JSON
2. Import contacts from file
3. Profile picture upload
4. Email verification
5. Password reset via email
6. Two-factor authentication
7. Contact groups/tags
8. Advanced search filters
9. Dark mode theme
10. Mobile app version

### Technical Improvements
1. Redis caching
2. Elasticsearch integration
3. WebSocket notifications
4. Docker containerization
5. CI/CD pipeline
6. Automated testing
7. API documentation (Swagger)
8. Performance monitoring

## Support & Documentation

- **Backend README:** See `README.md` in root
- **Frontend README:** See `frontend/README.md`
- **API Testing:** See `test-apis.sh`
- **Setup Guide:** See `FRONTEND_SETUP.md`

## Credits

Developed as part of the 10Pearls Internship Program.

**Technologies:**
- Spring Boot team
- React.js team
- Material-UI team
- Tailwind CSS team
- PostgreSQL community
- Maven & npm communities

## License

This project is part of the 10Pearls Internship Program.
