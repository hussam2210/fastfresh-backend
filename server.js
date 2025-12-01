const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

// اقرأ مفتاح فايربيس من الـ ENV
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

// تهيئة Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// إنشاء تطبيق Express
const app = express();

app.use(cors());
app.use(express.json());

// استيراد المسارات
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

// استخدام المسارات
app.use("/api/auth", authRoutes(db));
app.use("/api/orders", orderRoutes(db));

// تشغيل السيرفر
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
