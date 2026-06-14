# RentRent Monorepo

## Structure

- `frontend/` — Expo React Native app (MoveInn)
- `backend/` — Express API server (port 3001)

## Requirements

- **Node.js >= 20.19.4** (Expo 56; Node 18 will fail on `npm run build`)
- **MongoDB** running locally (default port 27017)

## Running

```bash
# Install all dependencies
npm install

# Set up indexes + seed data (requires MongoDB running locally)
cd backend
cp .env.example .env
npm run db:setup

# Start backend API (from project root)
npm run backend

# Start frontend (separate terminal)
npm run frontend
```

### Database collections

- `users` — user profiles
- `listings` — PG / co-living properties
- `saved_listings` — user saved properties
- `inquiries` — property inquiries
- `reviews` — user reviews

Set `EXPO_PUBLIC_API_URL` in `frontend/.env` when testing on a physical device (use your machine's LAN IP instead of localhost).

## Production (EC2 / PM2)

```bash
npm run build          # frontend web export + backend compile
npm run pm2:start      # serve frontend + /api/* on PORT (default 3001)
```

## Expo

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing frontend code.
