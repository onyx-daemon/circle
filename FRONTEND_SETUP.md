# Frontend Setup Guide

## Overview

This guide will help you set up and run the React.js frontend application for the Contact Management System.

## What's Been Built

A complete, production-ready React web application featuring:

### Pages
1. **Login Page** - User authentication with email/phone
2. **Registration Page** - New user signup
3. **Contacts Dashboard** - Main contact management interface
4. **Profile Page** - User profile and settings

### Key Features
- Full CRUD operations for contacts
- Search and filter functionality
- Pagination support
- Multiple emails and phone numbers per contact
- Password change capability
- Responsive design for all devices
- Beautiful animations and transitions
- JWT authentication
- Protected routes

### Technology Stack
- React.js (JavaScript)
- Material-UI components
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls
- React Router for navigation

## Quick Start

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages:
- react & react-dom
- @mui/material (Material-UI)
- tailwindcss
- lucide-react
- axios
- react-router-dom

### Step 2: Start the Backend

Make sure your Spring Boot backend is running on `http://localhost:8080`:

```bash
# In the root project directory
mvn spring-boot:run
```

### Step 3: Start the Frontend

```bash
# In the frontend directory
npm start
```

The application will automatically open at `http://localhost:3000`

## Application Flow

### 1. First Time Users

1. Visit `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Fill in registration form (email or phone required)
4. Automatically logged in after registration
5. Redirected to Contacts dashboard

### 2. Returning Users

1. Visit `http://localhost:3000/login`
2. Enter email/phone and password
3. Click "Sign In"
4. Redirected to Contacts dashboard

### 3. Managing Contacts

**Create Contact:**
- Click the blue "+" floating button (bottom right)
- Fill in contact details
- Add multiple emails and phones
- Click "Save Contact"

**Search Contacts:**
- Type in the search bar at the top
- Results filter as you type

**Edit Contact:**
- Click the edit icon on any contact card
- Modify details
- Click "Save Contact"

**Delete Contact:**
- Click the trash icon on any contact card
- Confirm deletion in the dialog

**Pagination:**
- Use pagination controls at the bottom
- Navigate through pages of contacts

### 4. Profile Management

- Click profile avatar (top right) or use menu
- View your account information
- Click "Change Password" to update password
- Use menu to logout

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── ChangePasswordModal.js    # Password change dialog
│   │   ├── ContactCard.js            # Contact display card
│   │   ├── ContactModal.js           # Create/Edit contact form
│   │   ├── DeleteConfirmDialog.js    # Delete confirmation
│   │   ├── Layout.js                 # Main layout with nav
│   │   └── ProtectedRoute.js         # Route authentication
│   ├── context/
│   │   └── AuthContext.js            # Authentication state
│   ├── pages/
│   │   ├── Contacts.js               # Main dashboard
│   │   ├── Login.js                  # Login page
│   │   ├── Profile.js                # Profile page
│   │   └── Register.js               # Registration page
│   ├── services/
│   │   └── api.js                    # API client & endpoints
│   ├── App.js                        # Main app component
│   ├── index.css                     # Global styles
│   └── index.js                      # App entry point
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
└── postcss.config.js                 # PostCSS configuration
```

## API Endpoints Used

The frontend integrates with these backend endpoints:

### Authentication APIs
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
GET    /api/auth/me                - Get current user
PUT    /api/auth/change-password   - Change password
```

### Contact APIs
```
GET    /api/contacts                      - Get all contacts (paginated)
GET    /api/contacts/search?query=...     - Search contacts
GET    /api/contacts/{id}                 - Get contact by ID
POST   /api/contacts                      - Create contact
PUT    /api/contacts/{id}                 - Update contact
DELETE /api/contacts/{id}                 - Delete contact
```

## Key Components Explained

### AuthContext
Manages authentication state globally:
- Stores user information
- Handles JWT token
- Provides login/logout functions
- Protects routes

### API Service
Centralized API client:
- Configures axios instance
- Adds authentication headers automatically
- Handles 401 errors (redirects to login)
- Groups endpoints by domain

### Layout Component
Main application shell:
- Navigation drawer
- App bar with user info
- Menu items
- Responsive sidebar

### ContactModal
Multi-purpose dialog for contact operations:
- Create new contacts
- Edit existing contacts
- Dynamic email/phone fields
- Add/remove entries
- Form validation

## Styling Approach

### Tailwind CSS
Utility-first CSS for:
- Spacing and layout
- Responsive design
- Animations
- Custom utilities

### Material-UI
Component library for:
- Buttons and inputs
- Dialogs and modals
- Cards and papers
- Navigation drawer

### Custom Theme
- Primary color: Sky blue (#0ea5e9)
- Clean, modern design
- Smooth transitions
- Accessible color contrast

## Features Breakdown

### Authentication
- JWT token storage in localStorage
- Automatic token injection in requests
- Token expiration handling
- Protected route wrapper

### Contact Management
- Paginated list view (9 per page)
- Real-time search
- Card-based display
- Quick actions (edit/delete)
- Floating action button

### Form Handling
- Validation before submission
- Error display
- Loading states
- Success feedback

### User Experience
- Smooth page transitions
- Loading indicators
- Error messages
- Confirmation dialogs
- Responsive layout

## Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Change this
    // ... other shades
  }
}
```

### Modify Pagination Size
Edit `src/pages/Contacts.js`:
```javascript
await contactAPI.getAll(page, 9)  // Change 9 to desired size
```

### Update API Base URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = '/api';  // Change if needed
```

## Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:** Ensure Spring Boot is running on port 8080

### Issue: "CORS error"
**Solution:** Backend has CORS configured for localhost:3000. Check SecurityConfig.java

### Issue: "401 Unauthorized"
**Solution:** Token expired. Logout and login again

### Issue: "npm install fails"
**Solution:** Delete node_modules and package-lock.json, then run npm install again

### Issue: "Page is blank"
**Solution:** Check browser console for errors. Ensure all dependencies are installed

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

To serve the production build:
```bash
npm install -g serve
serve -s build -p 3000
```

## Testing the Application

### Manual Testing Checklist

1. **Registration**
   - Register with email
   - Register with phone
   - Try duplicate registration (should fail)
   - Verify redirect to contacts

2. **Login**
   - Login with email
   - Login with phone
   - Try wrong password (should fail)
   - Verify redirect to contacts

3. **Contacts**
   - Create contact with single email/phone
   - Create contact with multiple emails/phones
   - Edit contact
   - Delete contact
   - Search contacts
   - Navigate pagination

4. **Profile**
   - View profile information
   - Change password
   - Verify logout

## Performance Optimization

The app includes:
- Code splitting with React.lazy (can be added)
- Optimized Material-UI imports
- Efficient re-renders with proper state management
- Debounced search (can be added)
- Pagination to limit data load

## Security Features

- JWT token authentication
- Protected routes
- Automatic token expiration handling
- Secure password input fields
- XSS protection via React
- CSRF protection via JWT

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Next Steps

Consider adding:
1. Remember me functionality
2. Email verification
3. Profile picture upload
4. Export contacts to CSV
5. Import contacts from file
6. Dark mode toggle
7. Contact groups/categories
8. Advanced search filters

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API calls
4. Review this documentation

## Credits

Built as part of the 10Pearls Internship Program.

Technology stack:
- React.js team
- Material-UI team
- Tailwind CSS team
- Lucide icons
