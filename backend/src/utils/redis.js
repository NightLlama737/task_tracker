const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://localhost:6379' // nebo tvůj Docker service name
});

redisClient.connect()
  .then(() => console.log('Redis připojeno'))
  .catch(err => console.error('Redis error', err));

module.exports = redisClient;
