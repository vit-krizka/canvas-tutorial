'use strict';

const express = require('express');
const redis = require("redis");

// Constants
const APP_PORT = process.env.APP_PORT;
const REDIS_URL = process.env.REDIS_URL;

// Redis
let redisClient;
(async () => {
  redisClient = redis.createClient({url: REDIS_URL});
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
})();

// App
const app = express();

app.use('/', express.static('public'))

// http://localhost/api/store/asdf?jkl=0
app.get('/api/save/:key', async (req, res) => {
  const { key } = req.params;
  const value = req.query;
  await redisClient.set(key, JSON.stringify(value));
  return res.send('Success');
});

// http://localhost/api/load/asdf
app.get('/api/load/:key', async (req, res) => {
  const { key } = req.params;
  const rawData = await redisClient.get(key);
  return res.json(JSON.parse(rawData));
});

app.listen(APP_PORT, () => {
  console.log(`Server listening on port ${APP_PORT}`);
});
