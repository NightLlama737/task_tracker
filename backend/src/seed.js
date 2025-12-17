const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

const redis = new Redis({ host: 'redis-stack', port: 6379 });

const categories = ['Matematika', 'Programování', 'Fyzika', 'Angličtina'];

async function seedTasks() {
  for (let i = 1; i <= 10; i++) {
    const id = uuidv4();
    const task = {
      id,
      title: `Testovací úkol ${i}`,
      description: `Popis úkolu ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      completed: false,
      createdAt: new Date().toISOString(),
    };
    // Použij JSON.SET přes redis.call
    await redis.call('JSON.SET', `task:${id}`, '$', JSON.stringify(task));
    await redis.expire(`task:${id}`, 30 * 24 * 60 * 60); // TTL 30 dní
  }
  console.log('Seed dokončen!');
  redis.quit();
}

seedTasks();
