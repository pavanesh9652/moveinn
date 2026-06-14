# RentRent Monorepo

## Structure

- `frontend/` — Expo React Native app (MoveInn)
- `backend/` — Express API server (port 3001)

## Running

```bash
# Install all dependencies
npm install

# Start PostgreSQL and set up tables + seed data
cd backend
cp .env.example .env
npm run db:up
npm run db:setup

# Start backend API (from project root)
npm run backend

# Start frontend (separate terminal)
npm run frontend
```

### Database tables

- `users` — user profiles
- `listings` — PG / co-living properties
- `saved_listings` — user saved properties
- `inquiries` — property inquiries
- `reviews` — user reviews

Set `EXPO_PUBLIC_API_URL` in `frontend/.env` when testing on a physical device (use your machine's LAN IP instead of localhost).

## Expo

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing frontend code.
