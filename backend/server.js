const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const flightRoutes = require("./src/routes/flightRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const trackingRoutes = require("./src/routes/trackingRoutes");
const healthRoutes = require("./src/routes/healthRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   "http://localhost:3000",
//   "http://localhost:5173"
// ].filter(Boolean);

// connectDB();

// app.use(
//   cors({
//     origin(origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error("Not allowed by CORS"));
//     },
//     credentials: true
//   })
// );
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Aeroledger API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/health", healthRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Server error",
    hint:
      err.name === "MongooseServerSelectionError"
        ? "MongoDB is not connected. Start MongoDB or update MONGO_URI in backend/.env."
        : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
