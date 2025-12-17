const express = require('express');
const { v4: uuidv4 } = require('uuid');

module.exports = (io, redis) => {
  const router = express.Router();

  // Get all tasks
  router.get('/', async (req, res) => {
    const keys = await redis.keys('task:*');
    const tasks = [];
    for (const key of keys) {
      const task = await redis.hgetall(key);
      tasks.push(task);
    }
    res.json(tasks);
  });

  // Create task
  router.post('/', async (req, res) => {
    const id = uuidv4();
    const { title, category, completed } = req.body;
    await redis.hmset(`task:${id}`, { id, title, category, completed: completed ? 'true' : 'false' });
    await redis.expire(`task:${id}`, 30 * 24 * 60 * 60); // TTL 30 dní
    io.emit('task_added', { id, title, category, completed });
    res.status(201).json({ id, title, category, completed });
  });

  // Update task
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, category, completed } = req.body;
    await redis.hmset(`task:${id}`, { title, category, completed: completed ? 'true' : 'false' });
    io.emit('task_updated', { id, title, category, completed });
    res.json({ id, title, category, completed });
  });

  // Delete task
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await redis.del(`task:${id}`);
    io.emit('task_deleted', { id });
    res.json({ id });
  });

  return router;
};
