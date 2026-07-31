# Backend Architecture: Node.js + Express + MongoDB

This is the primary architectural standard for all backend services. Read this FIRST before writing any backend code.

---

## 1. Architecture Pattern (MVC + Services Layer)

```
├── controllers/      # Request handling, calls services, returns response
├── services/         # Business logic layer (NEVER in controllers)
├── models/           # Mongoose schemas & model definitions
├── routes/           # Express route declarations
├── middlewares/      # Auth, validation, error handling, rate limiting
├── utils/            # Helpers, formatters, constants
├── config/           # DB connection, environment config
└── locales/          # i18n translation JSON files
```

### Rules:
- **Controllers** ONLY handle req/res. NO business logic inside controllers.
- **Services** contain ALL business logic. Controllers call services.
- **Models** define Mongoose schemas. NO queries outside models/services.
- Every route file MUST use Express Router and be registered in a central `routes/index.js`.

---

## 2. API Response Format (STRICT — NO EXCEPTIONS)

Every single API response MUST follow this exact shape:

**Success:**
```json
{
  "status": "success",
  "message": "Done",
  "data": { }
}
```

**Paginated Success:**
```json
{
  "status": "success",
  "message": "Done",
  "data": [ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "limit": 10
  }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "error_key_for_translation",
  "data": null
}
```

> ⚠️ Never return raw data without wrapping it in this structure.
> ⚠️ Error `message` MUST be a translation key (e.g., `'email_already_exists'`), NOT a human-readable sentence. The frontend handles translation.

---

## 3. Pagination Convention (Offset-Based)

All list endpoints MUST support pagination using query params:
- `?page=1&limit=10` (defaults: page=1, limit=10)
- Always return the `pagination` object in the response.
- Max allowed limit per request: **50**.

```javascript
// Reusable pagination helper
const paginate = async (Model, query, page = 1, limit = 10, sort = { createdAt: -1 }) => {
  const skip = (page - 1) * limit;
  const [data, totalItems] = await Promise.all([
    Model.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Model.countDocuments(query),
  ]);
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      limit,
    },
  };
};
```

---

## 4. Centralized Error Handling

### Custom AppError Class:
```javascript
class AppError extends Error {
  constructor(messageKey, statusCode) {
    super(messageKey);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Global Error Middleware (`middlewares/errorHandler.js`):
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'server_error';

  // Log full error in dev, only key in prod
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    status: 'error',
    message: req.t ? req.t(message) : message,
    data: null,
  });
};
```

### HTTP Status Code Conventions:
| Code | Meaning | When |
|------|---------|------|
| `200` | OK | Successful GET/PUT/PATCH |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation errors |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Valid token but no permission |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate (e.g., email already registered) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unhandled errors |

---

## 5. Request Validation (Joi)

All incoming request bodies, params, and queries MUST be validated using **Joi** schemas in a validation middleware. NEVER trust raw `req.body`.

```javascript
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    throw new AppError(messages, 400);
  }
  next();
};

// Usage in routes:
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

router.post('/login', validate(loginSchema), authController.login);
```

---

## 6. Authentication & Security Middleware

- **JWT Auth Middleware:** Verifies `Authorization: Bearer <token>` header.
- JWT tokens MUST have an expiry (`expiresIn`). Handle refresh token logic.
- Passwords MUST always be hashed with **bcrypt** before storing. NEVER store plain text.
- Always sanitize input to prevent NoSQL injection (use `express-mongo-sanitize`).
- Rate limit sensitive endpoints (login, register, password reset) with `express-rate-limit`.

```javascript
// Auth middleware pattern
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError('unauthorized', 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new AppError('user_not_found', 404);

  req.user = user;
  next();
};
```

---

## 7. Internationalization (i18n)

- Use `i18n` or `i18next` middleware to load translation files from `locales/`.
- All error messages from controllers/services MUST be translation keys, NOT raw English strings.
- `req.t('key')` resolves the translated string based on the `Accept-Language` header.

---

## 8. MongoDB Schema Rules (Project Standards)

> ⚠️ **IMPORTANT:** For ANY MongoDB work (models, queries, indexes, search), you MUST also read the relevant specialized skill from `backend/mongodb-*/`. See the **Related Skills** table at the bottom of this file.

These are **project-specific** conventions that apply to every Mongoose model in this codebase:

- **Always** use `timestamps: true` in every Schema definition — no exceptions.
- **Never** create a manual `id` field; use MongoDB's auto-generated `_id`.
- **Field names:** `camelCase` always (e.g., `firstName`, `downloadCount`). Never `snake_case`.
- **Embed vs Reference Decision:**
  - ✅ **Embed** → data is always read together & has no independent existence (e.g., address inside user)
  - ✅ **Reference** → data has independent existence or is shared across documents (e.g., products inside orders)
- **Indexing:** Add `index: true` on any field used frequently in `find()` or `sort()` queries.
- **Soft Delete:** Never hard-delete documents. Always add an `isDeleted` field defaulting to `false`, and filter it in every query:
  ```javascript
  const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    isDeleted: { type: Boolean, default: false },
  }, { timestamps: true });

  // Always filter in queries
  User.find({ isDeleted: false, ...otherFilters });
  ```

> ⚠️ For advanced schema design patterns (unbounded arrays, polymorphic schemas, tree structures, TTL), read the `mongodb-schema-design/` skill.

---

## Related Skills (MUST READ when applicable)

When working on the backend, the following specialized MongoDB skills are available inside this `backend/` folder:

| When you need... | Read this skill |
|-----------------|----------------|
| **Creating a Mongoose Model** | `backend/mongodb-schema-design/` — **ALWAYS read when defining a new schema** |
| **Database Connection Setup** | `backend/mongodb-connection/` |
| **Query Optimization & Indexing** | `backend/mongodb-query-optimizer/` |
| **Full-Text Search & AI/Vector** | `backend/mongodb-search-and-ai/` |
| **Natural Language → Query** | `backend/mongodb-natural-language-querying/` |
| **Real-Time Stream Processing** | `backend/mongodb-atlas-stream-processing/` |
| **MCP Server Setup** | `backend/mongodb-mcp-setup/` |

