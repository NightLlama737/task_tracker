const express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'tvuj_super_secret';

module.exports = (io, redis) => {
  const router = express.Router();

  // Middleware pro kontrolu tokenu
  const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded.username;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };

  // Get all tasks for user
  router.get('/', authMiddleware, async (req, res) => {
    const keys = await redis.keys(`task:${req.user}:*`);
    const tasks = [];
    for (const key of keys) {
      const task = await redis.hgetall(key);
      tasks.push(task);
    }
    res.json(tasks);
  });

  // Create task
  router.post('/', authMiddleware, async (req, res) => {
    const id = uuidv4();
    const { title, category, completed } = req.body;
    const key = `task:${req.user}:${id}`;
    await redis.hmset(key, { id, title, category, completed: completed ? 'true' : 'false' });
    await redis.expire(key, 30 * 24 * 60 * 60); // TTL 30 dní
    io.emit('task_added', { id, title, category, completed, username: req.user });
    res.status(201).json({ id, title, category, completed });
  });

  // Update task
  router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, category, completed } = req.body;
    const key = `task:${req.user}:${id}`;
    await redis.hmset(key, { title, category, completed: completed ? 'true' : 'false' });
    io.emit('task_updated', { id, title, category, completed, username: req.user });
    res.json({ id, title, category, completed });
  });

  // Delete task
  router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const key = `task:${req.user}:${id}`;
    await redis.del(key);
    io.emit('task_deleted', { id, username: req.user });
    res.json({ id });
  });

  return router;
};
