### Folder Structure
```
└── 📁batchbite
    └── 📁client
        └── 📁public
        └── 📁src
            └── 📁assets
            └── 📁context
                ├── AuthContext.jsx
            └── 📁pages
                ├── Dashboard.jsx
                ├── Login.jsx
                ├── Register.jsx
            └── 📁services
                ├── authService.js
            └── 📁styles
                ├── components.css
                ├── global.css
                ├── pages.css
            ├── App.jsx
            ├── main.jsx
        ├── .env
        ├── .gitignore
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── README.md
        ├── vite.config.js
    └── 📁server
        └── 📁src
            └── 📁config
                ├── db.js
            └── 📁controllers
                ├── authController.js
            └── 📁middleware
                ├── authMiddleware.js
            └── 📁models
                ├── User.js
            └── 📁routes
                ├── authRoutes.js
            └── 📁utils
                ├── generateToken.js
            ├── app.js
            ├── index.js
        ├── .env
        ├── package-lock.json
        ├── package.json
    └── README.md
```

## Module 0: Authentication System

### Features
- User registration (Student / Restaurant / Admin)
- Secure login with JWT authentication
- HTTP-only cookie-based session management
- Password hashing using bcrypt
- Role-based user system

### API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Implementation
- JWT stored in HTTP-only cookies
- Auth middleware (`protect`) validates session
- bcrypt used for password hashing
- AuthContext maintains frontend session state
