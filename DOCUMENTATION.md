# Aeroledger Topic Wise Documentation

This file explains the use of each requested topic in this project.

## React

React is used to build the frontend screens as reusable components.

Used in:

- `Frontened/src/App.js`
- `Frontened/src/components/`
- `Frontened/src/pages/`

Why it is used:

- It keeps the UI split into small parts.
- Each page can manage its own data and display.
- It makes the project easier to maintain.

## Create React App

The frontend uses Create React App through `react-scripts`.

Used in:

- `Frontened/package.json`

Why it is used:

- It avoids Vite.
- It gives standard React commands like `npm start` and `npm run build`.
- It is simple for college and basic full-stack projects.

## React Router

React Router handles frontend navigation without refreshing the page.

Used in:

- `Frontened/src/App.js`
- `Frontened/src/components/Navbar.js`
- `Frontened/src/components/ProtectedRoute.js`

Routes:

- `/` for flight search
- `/login` for login
- `/register` for registration
- `/bookings` for protected user bookings
- `/track` for flight tracking

## React Hooks

Hooks manage state and lifecycle behavior.

Used hooks:

- `useState` for form data, search results, messages, and selected flights.
- `useEffect` for loading logged-in user data and bookings.
- `useContext` for reading authentication state.

Examples:

- `Frontened/src/pages/SearchPage.js`
- `Frontened/src/pages/BookingsPage.js`
- `Frontened/src/context/AuthContext.js`

## Forms

Forms collect user input.

Used in:

- Login form
- Register form
- Flight search form
- Passenger booking form
- Flight tracking form

Each form stores input values in React state, then sends the values to the backend.

## Axios

Axios is used to call backend APIs.

Used in:

- `Frontened/src/api/api.js`
- Frontend pages that fetch or submit data

Why it is used:

- It keeps API calls simple.
- It allows one shared base URL.
- It attaches JWT tokens automatically through an interceptor.

## Node.js

Node.js runs the backend JavaScript server.

Used in:

- `backend/server.js`
- All backend source files

Why it is used:

- It lets JavaScript run outside the browser.
- It is commonly used with Express and MongoDB.

## Express

Express creates backend API routes.

Used in:

- `backend/server.js`
- `backend/src/routes/`

Why it is used:

- It handles API requests from the frontend.
- It separates routes into clean modules.
- It supports middleware like authentication and JSON parsing.

## MongoDB

MongoDB stores users and bookings.

Used in:

- `backend/src/models/User.js`
- `backend/src/models/Booking.js`
- `backend/src/config/db.js`

Why it is used:

- It stores flexible document data.
- It works well with JavaScript objects.
- It is suitable for user and booking records.

## Mongoose

Mongoose connects Express to MongoDB using schemas and models.

Why it is used:

- It validates data before saving.
- It gives simple functions like `create`, `find`, `findOneAndUpdate`, and `findOneAndDelete`.

## CRUD Operations

CRUD means:

- Create booking
- Read bookings
- Update booking status
- Delete booking

Used in:

- `backend/src/controllers/bookingController.js`
- `backend/src/routes/bookingRoutes.js`
- `Frontened/src/pages/BookingsPage.js`

## JWT Authentication

JWT protects private routes.

Used in:

- `backend/src/utils/token.js`
- `backend/src/middleware/authMiddleware.js`
- `Frontened/src/context/AuthContext.js`
- `Frontened/src/api/api.js`

How it works:

1. User logs in or registers.
2. Backend creates a JWT token.
3. Frontend stores token in `localStorage`.
4. Axios sends token in the `Authorization` header.
5. Backend verifies token before allowing bookings and payments.

## Environment Variables

Environment variables keep sensitive data outside the source code.

Used in:

- `backend/.env.example`
- `Frontened/.env.example`

Examples:

- MongoDB URL
- JWT secret
- API keys
- Backend API URL

## Amadeus

Amadeus is used for flight search.

Used in:

- `backend/src/services/amadeusService.js`
- `GET /api/flights/search`

Current behavior:

- Mock flight data is returned by default.
- Real Amadeus API can be enabled with keys and `USE_MOCK_EXTERNALS=false`.

## Aviationstack

Aviationstack is used for flight tracking.

Used in:

- `backend/src/services/aviationstackService.js`
- `GET /api/tracking`
- `GET /api/health`

Current behavior:

- Mock tracking data is returned by default.
- Real tracking can be enabled with an API key.

## FlightRadar24

FlightRadar24 is used as the primary live-tracking source when the token is configured.

Used in:

- `backend/src/services/flightradar24Service.js`
- `backend/src/services/aviationstackService.js`
- `GET /api/tracking`

Current behavior:

- Real FR24 live data is used when `FR24_API_TOKEN` is set and valid.
- If FR24 is unavailable, the app falls back to Aviationstack or mock data.

## ADSBdb

ADSBdb is used for route enrichment.

Used in:

- `backend/src/services/adsbdbService.js`
- `GET /api/flights/route/:callsign`

Why it is used:

- It adds extra aircraft and route details for a flight callsign.

## Razorpay Clone

The project includes a simple local Razorpay-style payment flow.

Used in:

- `backend/src/controllers/paymentController.js`
- `Frontened/src/pages/SearchPage.js`

How it works:

1. Frontend asks backend to create a payment order.
2. Backend returns a fake order ID.
3. Frontend sends verification request.
4. Backend returns a fake paid payment ID.
5. Booking is created with payment status.

## Deployment

Frontend can be deployed on:

- Vercel
- Netlify

Backend can be deployed on:

- Render
- Heroku
- AWS EC2

The frontend and backend connect through:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

The backend allows frontend requests through:

```env
CLIENT_URL=https://your-frontend-url.com
```
