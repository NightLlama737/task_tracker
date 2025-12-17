const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Základní autentizace (příklad)
module.exports = (redis) => {

  router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    await redis.hset(`user:${username}`, 'password', password);
    res.json({ message: 'User registered' });
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const storedPassword = await redis.hget(`user:${username}`, 'password');
    if (storedPassword !== password) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
    await redis.set(`token:${token}`, username, 'EX', 3600); // uloží token do Redis
    res.json({ token });
  });

  return router;
};
