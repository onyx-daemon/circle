# Getting Started - Contact Management System

## What's Been Created

A complete, production-ready full-stack web application for managing contacts.

### Backend (Already Exists)
- Java Spring Boot REST API
- PostgreSQL database
- JWT authentication
- Full CRUD operations
- Running on port 8080

### Frontend (Just Created)
- React.js web application
- Material-UI components
- Tailwind CSS styling
- Lucide React icons
- Running on port 3000

## Instant Setup - 3 Steps

### 1. Start Backend
```bash
# In project root
mvn spring-boot:run
```
Wait for: "Started CircleApplication"

### 2. Start Frontend
```bash
# Open new terminal
cd frontend
npm install
npm start
```
Browser opens automatically at http://localhost:3000

### 3. Use the App
1. Click "Sign Up"
2. Create your account
3. Start managing contacts!

## First Time User Guide

### Step 1: Register an Account
1. Open http://localhost:3000
2. Click "Sign Up" link
3. Fill in the form:
   - First Name: Your first name
   - Last Name: Your last name
   - Email: your@email.com (OR)
   - Phone: +1234567890 (at least one required)
   - Password: Min 6 characters
   - Confirm Password: Same as password
4. Click "Create Account"
5. You're automatically logged in!

### Step 2: Add Your First Contact
1. Click the blue "+" button (bottom right)
2. Fill in contact details:
   - First Name: Jane
   - Last Name: Smith
   - Title: Software Engineer
3. Add Email:
   - Email: jane@example.com
   - Type: WORK
4. Add Phone:
   - Phone: +1234567890
   - Type: WORK
5. Click "Save Contact"

### Step 3: Explore Features
- **Search:** Type in the search bar to find contacts
- **Edit:** Click pencil icon on any contact card
- **Delete:** Click trash icon, confirm deletion
- **View Profile:** Click avatar in top right
- **Change Password:** Profile page → "Change Password"
- **Logout:** Open menu → "Logout"

## Application Structure

### Main Pages

1. **Login** (`/login`)
   - Email or phone login
   - Password field with show/hide
   - Link to registration

2. **Register** (`/register`)
   - New user signup
   - Validates input
   - Auto-login after signup

3. **Contacts** (`/contacts`)
   - Main dashboard
   - Card-based layout
   - Search functionality
   - Pagination
   - Create/Edit/Delete

4. **Profile** (`/profile`)
   - User information
   - Change password
   - Account details

## Key Features Explained

### Authentication
- Secure JWT token-based auth
- Token stored in browser
- Auto-logout on expiration
- Protected routes

### Contact Management
- Create contacts with multiple emails/phones
- Search by first or last name
- Edit any contact anytime
- Delete with confirmation
- Pagination (9 per page)

### User Experience
- Smooth animations
- Loading indicators
- Error messages
- Success feedback
- Responsive design
- Mobile-friendly

## Technology Overview

### Frontend Stack
```
React.js          → UI framework
Material-UI       → Beautiful components
Tailwind CSS      → Modern styling
Lucide React      → Icons
Axios             → API calls
React Router      → Navigation
```

### Backend Stack
```
Spring Boot       → REST API
PostgreSQL        → Database
JWT               → Authentication
JPA/Hibernate     → ORM
BCrypt            → Password security
```

## Common Tasks

### Add Contact with Multiple Emails
1. Click "+" button
2. Fill in name and title
3. Add first email
4. Click "Add Email" for more
5. Select email types (WORK, PERSONAL, OTHER)
6. Click "Save Contact"

### Search Contacts
1. Type in search bar at top
2. Results filter automatically
3. Search works on first name and last name

### Change Password
1. Click profile avatar
2. Click "Change Password"
3. Enter current password
4. Enter new password (min 6 chars)
5. Confirm new password
6. Click "Update Password"

### Navigate Pages
1. Scroll to bottom of contacts list
2. Use pagination numbers
3. Click page number to navigate

## File Locations

### Frontend Files
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.js          ← Login page
│   │   ├── Register.js       ← Signup page
│   │   ├── Contacts.js       ← Main dashboard
│   │   └── Profile.js        ← Profile page
│   ├── components/
│   │   ├── ContactCard.js    ← Contact display
│   │   ├── ContactModal.js   ← Create/Edit form
│   │   └── Layout.js         ← Navigation
│   ├── services/
│   │   └── api.js            ← API client
│   └── context/
│       └── AuthContext.js    ← Auth state
```

### Backend Files (Already Exists)
```
src/main/java/com/susa/circle/
├── controller/
│   ├── AuthController.java     ← Auth endpoints
│   └── ContactController.java  ← Contact endpoints
├── service/
│   ├── AuthService.java        ← Auth logic
│   └── ContactService.java     ← Contact logic
└── security/
    ├── JwtUtil.java            ← JWT handling
    └── SecurityConfig.java     ← Security setup
```

## Design System

### Colors
- **Primary Blue:** #0ea5e9 (Sky blue)
- **Secondary Blue:** #0284c7 (Ocean blue)
- **Accent Blue:** #0369a1 (Deep blue)
- **Error Red:** #ef4444
- **Success Green:** #10b981
- **Gray Shades:** 50-900

### Typography
- **Font:** System fonts (San Francisco, Segoe UI, Roboto)
- **Headings:** Bold, 24-32px
- **Body:** Regular, 14-16px
- **Small:** 12-14px

### Spacing
- Uses 8px grid system
- Consistent padding and margins
- Balanced white space

### Components
- Rounded corners (8-12px radius)
- Subtle shadows
- Smooth transitions (300ms)
- Hover states on interactive elements

## API Endpoints Reference

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/change-password
```

### Contacts
```
GET    /api/contacts
GET    /api/contacts/search?query=<term>
GET    /api/contacts/<id>
POST   /api/contacts
PUT    /api/contacts/<id>
DELETE /api/contacts/<id>
```

## Quick Troubleshooting

### Backend Won't Start
```bash
# Check if port 8080 is in use
lsof -i :8080
# Kill the process if needed
kill -9 <PID>
# Start PostgreSQL
sudo systemctl start postgresql
```

### Frontend Won't Start
```bash
# Delete and reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't Login
- Check backend is running (http://localhost:8080)
- Clear browser localStorage
- Try registering a new account

### Contacts Won't Load
- Open browser console (F12)
- Check for error messages
- Verify JWT token exists
- Try logging out and back in

## Next Steps

### Learn More
- Read `FRONTEND_SETUP.md` for detailed frontend docs
- Read `FULLSTACK_GUIDE.md` for architecture details
- Read `README.md` for backend documentation

### Customize
1. **Change Colors:** Edit `frontend/tailwind.config.js`
2. **Modify Logo:** Update "Circle" text in `Layout.js`
3. **Add Features:** Create new components in `frontend/src/components`

### Deploy
1. **Build Frontend:** `npm run build` in frontend folder
2. **Build Backend:** `mvn package` in root
3. **Deploy:** Use any cloud provider (AWS, Heroku, etc.)

## Help & Support

### Documentation
- Backend: `README.md`
- Frontend: `frontend/README.md`
- Full Stack: `FULLSTACK_GUIDE.md`
- Frontend Setup: `FRONTEND_SETUP.md`

### Testing
- Manual testing: Follow steps in this guide
- Backend tests: `mvn test`
- API testing: `./test-apis.sh`

### Common Questions

**Q: Do I need both servers running?**
A: Yes, backend (8080) and frontend (3000) must both run.

**Q: Can I use phone number to login?**
A: Yes, use either email or phone number.

**Q: How many contacts can I add?**
A: Unlimited, but shows 9 per page for performance.

**Q: Can I add multiple emails to one contact?**
A: Yes, click "Add Email" in the contact form.

**Q: Is my data secure?**
A: Yes, passwords are encrypted and JWT tokens secure API calls.

## Success Checklist

- [ ] PostgreSQL running
- [ ] Backend started (port 8080)
- [ ] Frontend installed (`npm install`)
- [ ] Frontend started (port 3000)
- [ ] Registered a user
- [ ] Created a contact
- [ ] Searched contacts
- [ ] Edited a contact
- [ ] Changed password
- [ ] Viewed profile

## Congratulations!

You now have a fully functional contact management system with:
- Beautiful, modern UI
- Secure authentication
- Complete CRUD operations
- Search and pagination
- Responsive design
- Production-ready code

Enjoy managing your contacts!
