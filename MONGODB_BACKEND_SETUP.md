# MongoDB Backend Connection

The backend connects to MongoDB from:

```text
backend/src/config/db.js
```

Connection code:

```js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flight_booking_system";
    const connection = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

module.exports = connectDB;
```

The connection is started inside:

```text
backend/server.js
```

```js
connectDB();
```

## Local MongoDB URL

This project uses this local database by default:

```env
MONGO_URI=mongodb://127.0.0.1:27017/flight-booking-app
```

Database name:

```text
flight-booking-app
```

Collections created by Mongoose:

```text
users
bookings
```

## Start Backend

```bash
cd backend
npm install
npm run dev
```

When the connection works, the terminal shows:

```text
MongoDB connected: 127.0.0.1/flight-booking-app
```

## Use MongoDB Atlas Instead

Replace the local URL in `backend/.env` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster-url/flight-booking-app
```

Keep the password private and do not upload `.env` to GitHub.
