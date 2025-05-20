# TODO - Next Steps for Home Lab Web App

This document outlines the next steps for the development and improvement of the Home Lab Web App.

## High Priority

*   **Security & Dependencies:**
    *   [ ] **Update Outdated Dependencies:** Run `npm audit` to identify vulnerabilities and update dependencies listed in `package.json` to their latest secure versions. Pay special attention to any reported critical or high severity vulnerabilities.
    *   [ ] **Consistent Input Validation:** Extend the use of `express-validator` to all input fields across all forms and API endpoints to ensure data integrity and prevent injection attacks. Currently, its usage might be inconsistent.
*   **Features & Functionality:**
    *   [ ] **Implement CSV Export for Devices:** The README mentions "CSV export functionality for device data" but it's not clear if this is fully implemented or where it's accessible. Ensure this feature is present and working, allowing users to export their device list.
    *   [ ] **Server-Side Pagination for Device List:** The current dashboard likely loads all devices at once. Implement server-side pagination for the device list on the dashboard to improve performance, especially for users with many devices.
*   **Documentation:**
    *   [ ] **Update `README.md`:**
        *   Reflect the actual file structure if it has changed.
        *   Update the API routes section if new routes were added or existing ones changed.
        *   Verify that all features mentioned in the README (like CSV export) are actually implemented and documented correctly.
        *   Clarify the SSL certificate generation process and permissions for different operating systems if needed.

## Medium Priority

*   **Code Quality & Maintainability:**
    *   [ ] **Clarify TypeScript Usage:** The project contains `.ts` files in `components/` and `services/` (e.g., `dashboard.component.ts`, `device.model.ts`, `lab.model.ts`, `dashboard.service.ts`) but `package.json` doesn't show TypeScript as a direct dependency or build step. Investigate their purpose. If they are actively used, add TypeScript and necessary types (e.g., `@types/express`) to `devDependencies` and configure a build process. If they are remnants of a past approach, remove them to avoid confusion.
    *   [ ] **Remove Unused Code:** The `csrfProtection` variable is defined in `app.js` but might not be used directly if `res.locals.csrfToken = req.csrfToken()` is handling CSRF token generation for views. Verify and remove if redundant.
*   **Error Handling:**
    *   [ ] **Standardize Error Responses:** Ensure all API routes return errors in a consistent format (e.g., JSON with an `error` message). Review `errorHandler.js` and its application.
*   **User Experience (UX) & Performance:**
    *   [ ] **Dashboard Table Enhancements:** For users with many devices, client-side sorting and searching can become slow. Explore options for server-side assistance for these operations or more optimized client-side solutions if server-side pagination is implemented.

## Low Priority

*   **Testing:**
    *   [ ] **Increase Test Coverage:** Review existing tests in the `tests/` directory. Identify critical parts of the application (e.g., authentication, device CRUD operations, new features) that lack sufficient test coverage and add new tests.
*   **Refinements:**
    *   [ ] **Review Logging:** Evaluate the current logging setup (`morgan('dev')`). For production, consider a more structured logging format (e.g., JSON) and configurable log levels. Winston is a dependency, but not explicitly used in `app.js` for general request logging.
    *   [ ] **Session Management Review:** While Redis is used for session storage, review session expiry, rotation, and invalidation mechanisms for robustness.
