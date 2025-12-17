const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const redisClient = require('../utils/redis'); // Tvůj Redis client

const JWT_SECRET = 'tvuj_super_secret'; // Později přes env proměnnou

// Registrace uživatele
router.post('/register', 
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const exists = await redisClient.hExists('users', username);
    if (exists) return res.status(400).json({ message: 'Uživatel už existuje' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await redisClient.hSet('users', username, JSON.stringify({ username, password: hashedPassword }));

    res.status(201).json({ message: 'Uživatel vytvořen' });
});

// Login
router.post('/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  async (req, res) => {
    const { username, password } = req.body;
    const userData = await redisClient.hGet('users', username);
    if (!userData) return res.status(400).json({ message: 'Neplatné přihlašovací údaje' });

    const user = JSON.parse(userData);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Neplatné přihlašovací údaje' });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
