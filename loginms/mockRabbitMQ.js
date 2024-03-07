const express = require('express');
const app = express();
const PORT = 3005;

const mockMessage = { /* Mockad data */ };

app.get('/connect', (req, res) => {
  res.send('Connected to RabbitMQ');
});

app.get('/consume', (req, res) => {
  res.json(mockMessage);
});

app.listen(PORT, () => {
  console.log(`Mock RabbitMQ server is running on port ${PORT}`);
});

module.exports = app;
