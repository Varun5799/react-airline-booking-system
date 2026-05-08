# Aeroledger

Aeroledger is a basic but reliable full-stack flight booking project made with only the requested topics:

- React with Create React App
- React Router
- React hooks: `useState`, `useEffect`
- Forms and form state
- Axios for frontend to backend requests
- Node.js and Express
- MongoDB with Mongoose
- JWT authentication
- Environment variables
- External service adapters for Amadeus, Aviationstack, ADSBdb, and a Razorpay-style payment clone

The frontend folder is intentionally named `Frontened` because that was requested.

## Folder Structure

```text
flight-booking-system/
  Frontened/
    public/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      App.js
      index.js
      styles.css
    package.json
    .env.example
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    server.js
    package.json
    .env.example
```

## How To Run

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

MongoDB must be running locally, or you can place a MongoDB Atlas URL in `backend/.env`.

### 2. Frontend

Open a second terminal:

```bash
cd Frontened
npm install
copy .env.example .env
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

## Main Features

- User registration and login
- JWT protected booking routes
- Flight search
- Passenger booking form
- Razorpay clone payment order and verification
- Booking create, read, update, and delete operations
- Flight tracking page
- Route enrichment page data
- Responsive layout for desktop and mobile

## External Services

The backend has separate service files for each external provider:

- `backend/src/services/amadeusService.js`
- `backend/src/services/aviationstackService.js`
- `backend/src/services/adsbdbService.js`

By default, `USE_MOCK_EXTERNALS=true` is used. This makes the app work without paid API keys.

To use real services later, update `backend/.env`:

```env
USE_MOCK_EXTERNALS=false
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
AVIATIONSTACK_KEY=your_key
FR24_API_TOKEN=your_flightradar24_api_token
```

## Deployment Notes

### Frontend on Vercel or Netlify

Use the `Frontened` folder as the project root.

Build command:

```bash
npm run build
```

Output folder:

```text
build
```

Environment variable:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend on Render, Heroku, or EC2

Use the `backend` folder as the service root.

Start command:

```bash
npm start
```

Required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_secret
CLIENT_URL=https://your-frontend-url.com
```

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Flights

- `GET /api/flights/search?from=DEL&to=BOM&date=2026-05-01&passengers=1`
- `GET /api/flights/route/:callsign`

### Tracking

- `GET /api/tracking?flightNumber=AI202`

### Health

- `GET /api/health`

### Payments

- `POST /api/payments/order`
- `POST /api/payments/verify`

### Bookings

- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id`
- `DELETE /api/bookings/:id`
