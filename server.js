// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// ---------- Health Check ----------
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Firebase Tunnel Running'
  });
});

// ---------- Login Route ----------
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        message: 'FIREBASE_API_KEY is not set on the server'
      });
    }

    // call Firebase Identity Toolkit REST API
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const firebaseResponse = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });

    const data = firebaseResponse.data;

    // success
    return res.json({
      status: 'ok',
      uid: data.localId,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      email: data.email
    });
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);

    const code = err.response?.status || 500;
    const message =
      err.response?.data?.error?.message || 'Unknown error from Firebase';

    return res.status(code).json({
      status: 'error',
      message
    });
  }
});

// ---------- Start server ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
