# TODO: Homelab App Improvement Phases

## Phase 1: Codebase Consistency & Structure
- Migrate all backend code to TypeScript or standardize on JavaScript
- Move source code into a `src/` folder
- Separate test files into a dedicated `tests/` or `__tests__/` folder

## Phase 2: Configuration & Documentation
- Use environment variables for sensitive config
- Add a `.env.example` file
- Add or update `.gitignore`
- Expand `README.md` with setup, usage, and contribution instructions
- Add API documentation (Swagger/OpenAPI if applicable)

## Phase 3: Testing & Quality
- Ensure tests cover critical functionality
- Integrate tests with CI
- Add more unit/integration tests
- Add ESLint and Prettier
- Add lint and format scripts to `package.json`

## Phase 4: Security & Performance
- Review middleware for security best practices
- Ensure robust authentication and authorization
- Audit dependencies for vulnerabilities
- Add logging and monitoring
- Optimize static asset delivery

## Phase 5: Build, Deployment & Monitoring
- Update Dockerfile and docker-compose.yml
- Automate builds and deployments (CI/CD)
- Add performance monitoring tools

---
Add more items as needed for future improvements.
