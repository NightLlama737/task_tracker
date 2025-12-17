const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const redis = require('./utils/redis');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/tasks', taskRoutes(io, redis));
app.use('/auth', authRoutes(redis));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
