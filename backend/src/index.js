const express = require('express');
const app = express();
const PORT = 4000;

const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));
