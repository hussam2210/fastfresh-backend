const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

// اقرأ مفتاح Firebase من الـ ENV
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
} catch (e) {
  console.error("Invalid SERVICE_ACCOUNT_JSON:", e.message);
  process.exit(1);
}

// تهيئة Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// ---------------- Auth Routes ----------------
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty)
      return res.status(400).json({ message: "User already exists" });

    await usersRef.add({
      email,
      password,
      createdAt: new Date(),
    });

    return res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Orders Routes ----------------
app.post("/api/orders", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title)
      return res.status(400).json({ message: "Missing title" });

    const doc = await db.collection("orders").add({
      title,
      description: description || "",
      createdAt: new Date(),
    });

    res.json({ id: doc.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- Root ----------------
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Firebase Tunnel Running" });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);
