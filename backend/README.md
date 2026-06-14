# RentRent Backend

Express API for the MoveInn app.

## Folder structure

```
src/
├── index.ts          # Entry point — DB check + start server
├── app.ts            # Express app factory (middleware, static files, routes)
├── config.ts         # App-level constants (location, filter chips, etc.)
├── routes/           # HTTP handlers, grouped by resource
│   ├── index.ts      # Mounts all routers under /api
│   ├── health.ts
│   ├── auth.ts
│   ├── appConfig.ts
│   ├── listings.ts
│   └── users.ts
├── middleware/       # Express middleware (auth, etc.)
├── repositories/     # Database access layer
├── db/               # Connection pool, migrations, seed
└── types/            # Shared TypeScript types
```

## Request flow

```
HTTP request → routes/ → middleware/ (if needed) → repositories/ → PostgreSQL
```

## API routes

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | No |
| POST | `/api/auth/signup` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/config` | No |
| GET | `/api/listings` | No |
| GET | `/api/listings/:id` | No |
| GET | `/api/user` | Bearer token |

## Running

```bash
cp .env.example .env
npm run db:setup    # migrate + seed (requires PostgreSQL)
npm start           # production-style start
npm run dev         # watch mode
```
