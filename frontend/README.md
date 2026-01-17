# Contact Management System - Frontend

A modern, aesthetic React.js web application for managing contacts, built with Material-UI, Tailwind CSS, and Lucide React icons.

## Features

- User authentication (Login/Register)
- Contact management (Create, Read, Update, Delete)
- Search and filter contacts
- Paginated contact listing
- User profile management
- Password change functionality
- Responsive design
- Beautiful UI with smooth animations

## Technology Stack

- **React.js** - Frontend framework
- **Material-UI** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Navigation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChangePasswordModal.js
│   │   ├── ContactCard.js
│   │   ├── ContactModal.js
│   │   ├── DeleteConfirmDialog.js
│   │   ├── Layout.js
│   │   └── ProtectedRoute.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Contacts.js
│   │   ├── Login.js
│   │   ├── Profile.js
│   │   └── Register.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Available Scripts

### `npm start`
Runs the app in development mode.

### `npm build`
Builds the app for production.

### `npm test`
Launches the test runner.

## API Integration

The frontend connects to the backend API at `http://localhost:8080/api` with the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Contacts
- `GET /api/contacts` - Get all contacts (paginated)
- `GET /api/contacts/search` - Search contacts
- `GET /api/contacts/{id}` - Get contact by ID
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact

## Features Overview

### Authentication
- Clean login and registration forms
- Password visibility toggle
- Form validation
- JWT token management
- Automatic redirection on authentication

### Contact Management
- Card-based contact display
- Search by first name or last name
- Pagination support
- Create new contacts with multiple emails and phone numbers
- Edit existing contacts
- Delete contacts with confirmation
- Floating action button for quick contact creation

### User Profile
- View user information
- Change password
- Logout functionality

### UI/UX Features
- Smooth animations and transitions
- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications
- Beautiful color scheme using blue tones
- Material Design principles

## Design System

### Colors
- Primary: Sky blue (#0ea5e9)
- Secondary: Ocean blue (#0284c7)
- Accent: Deep blue (#0369a1)
- Error: Red (#ef4444)
- Success: Green (#10b981)

### Typography
- System fonts for optimal performance
- Clear hierarchy with proper font sizes
- Consistent spacing and line heights

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of the 10Pearls Internship Program.
