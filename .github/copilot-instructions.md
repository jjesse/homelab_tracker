# Home Lab Management Application - AI Coding Instructions

## Architecture Overview

This is a Node.js/Express home lab device management application with a **dual-codebase structure**: JavaScript files in root directories and TypeScript files in `src/`. The JavaScript files contain the actual working implementation, while TypeScript files are mostly stub/template files for migration.

**Key architectural patterns:**
- **Authentication**: Passport.js with session-based auth using Redis for session storage
- **Database**: MongoDB with Mongoose ODM for device and user models
- **Security**: Comprehensive middleware stack (helmet, CSRF, rate limiting, sanitization)
- **Deployment**: Docker-first with multi-architecture support (AMD64/ARM64)

## Critical File Structure

```
/                    # JavaScript implementation (ACTIVE)
├── models/          # Mongoose schemas (Device.js, User.js)
├── routes/          # Express routes (devices.js, users.js, index.js)
├── config/          # Auth, passport, redis configs
├── middleware/      # Security, error handling
└── views/           # EJS templates

src/                 # TypeScript stubs (INACTIVE - migration target)
└── [mirrors above structure with minimal TypeScript code]
```

## Development Workflow

**Key Commands:**
```bash
# Development
npm run dev                    # nodemon with hot reload
npm run dev:debug             # with Node inspector

# Testing  
npm test                      # Jest with coverage (80% threshold)
npm run test:watch           # Jest watch mode

# Docker (primary deployment method)
docker-compose up --build    # Full stack with MongoDB + Redis
```

**Environment Setup:**
- Copy `.env.example` to `.env` - contains all required variables
- MongoDB/Redis credentials are user-defined (not pre-existing)
- SSL certificates auto-generated or mounted from `./certs/`

## Code Patterns & Conventions

**Authentication Middleware:**
```javascript
const { ensureAuthenticated } = require('../config/auth');
// Use on all protected routes
```

**Device Schema Fields (models/Device.js):**
- Core: name, ipAddress, operatingSystem, hostname, network
- Advanced: systemRole, hypervisorInstalledOn, domainUserSignedIn
- Optional: zscalerUserSignedIn, zscalerAppSegment (default: 'None')

**Security Stack (applied in src/app.ts):**
1. Helmet for headers
2. Rate limiting (general + API-specific)
3. CSRF protection with cookie-based tokens
4. MongoDB sanitization
5. Session security with Redis

**Frontend Patterns:**
- EJS templating with layouts (`views/layout.ejs`)
- Vanilla JS for interactivity (`public/scripts/dashboard.js`)
- Chart.js integration for device analytics
- AJAX for device operations with CSRF tokens

## Integration Points

**Database Models:**
- User-scoped devices (`device.user` references `User._id`)
- CSV import/export functionality in `routes/devices.js`
- File uploads to `uploads/` directory

**Docker Architecture:**
- App container on port 5000 (mapped to 80/443)
- MongoDB with health checks and auth
- Redis for sessions
- Shared network: `homelab_network`

**Security Considerations:**
- CSRF tokens required for all forms
- Rate limiting on `/api/` and `/users/login`
- Session cookies with httpOnly/secure flags
- File upload restrictions (CSV only)

## Common Tasks

**Adding new device fields:**
1. Update `models/Device.js` schema
2. Modify device forms in `views/`
3. Update CSV import logic in `routes/devices.js`
4. Add frontend validation if needed

**Route protection:**
```javascript
router.get('/protected', ensureAuthenticated, (req, res) => {
  // req.user available here
});
```

**Multi-architecture builds:**
```bash
./build.sh  # Uses Docker buildx for AMD64/ARM64
```