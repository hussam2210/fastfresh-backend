const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();

// اقرأ مفتاح فايربيس من المتغيّر SERVICE_ACCOUNT_JSON
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
app.use("/api/auth", authRoutes(db));
app.use("/api/orders", orderRoutes(db));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
