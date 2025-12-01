const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// --- Firebase Admin from ENV ---
const rawServiceAccount = process.env.SERVICE_ACCOUNT_JSON;

if (!rawServiceAccount) {
  console.error("SERVICE_ACCOUNT_JSON is not set");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(rawServiceAccount);
} catch (e) {
  console.error("Failed to parse SERVICE_ACCOUNT_JSON:", e.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// --- Express app ---
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

app.use("/api/auth", authRoutes(db));
app.use("/api/orders", orderRoutes(db));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
