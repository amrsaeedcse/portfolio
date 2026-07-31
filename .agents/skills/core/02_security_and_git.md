# Code Quality Standards
- **Prefer Immutability & Constants:** Always use immutable data structures and compile-time constants where possible to prevent state side-effects and optimize memory.
- **Max file length:** 200 lines. If exceeded, split into smaller, focused files.
- **No magic numbers or strings:** Every literal value must live in a named constant.
- **No commented-out dead code** should be committed. Use `MEMORY.md` to document why something was removed instead.
- **Every public method/class** must have a one-line doc comment (`///`).
- **Before adding any new package**, check if the existing dependencies already cover the use case. If adding is necessary, log it in `MEMORY.md` under Package Registry.
- **Production Logging:** Never use raw console loggers in production. Always use proper log levels or wrap debug logs under environment checks.
- **Naming Conventions:**
  - Files: `snake_case`
  - Classes: `PascalCase`
  - Variables & methods: `camelCase`
  - Constants: `kCamelCase`
  - MongoDB collections: `camelCase` plural (e.g., `users`, `blogPosts`)

---

# Security Rules
- **NEVER** hardcode API keys, secrets, or tokens in the codebase.
- All sensitive values MUST live in `.env` and be loaded as follows:
  - **Flutter:** load at runtime using `flutter_dotenv` → `await dotenv.load(fileName: ".env")` inside `AppInitializer`, then reference via `dotenv.env['KEY_NAME']`. **Do NOT use `--dart-define`.**
  - **Node.js:** reference via `process.env.KEY_NAME`.
- Always keep `.env.example` updated — it should mirror `.env` keys with empty or dummy values only.
- On the backend, always validate and sanitize incoming request data before passing it to services or models.
- Passwords must always be hashed (e.g., `bcrypt`) before storing in the database. Never store plain text passwords.
- JWT tokens must have an expiry. Always handle token refresh logic in `api_interceptors.dart`.
- Backend error responses MUST use the key `message` for the human-readable error string, as `ServerFailure.fromResponse` reads `response[ApiKeys.message]`.

---

# Git & Commit Conventions
Always write commit messages following this pattern:
`<type>(<scope>): <short description>`

Types allowed: `feat` | `fix` | `refactor` | `docs` | `chore` | `style`

Examples:
- `feat(auth): add Google Sign-In flow`
- `fix(api): handle 401 token expiry in interceptor`
- `docs(memory): log pagination architecture decision`

**Rule:** Never commit directly to `main`. Always work on a feature branch.
