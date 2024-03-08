const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Middleware to parse request body
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


function createDynamicProxy(targetIP) {
  return createProxyMiddleware({ 
    target: `http://${targetIP}`, 
    changeOrigin: true,
    onProxyReq:(proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  });
}

app.use('/event', createDynamicProxy('eventmicroservice.default.svc.cluster.local:5002'));
app.use('/users', createDynamicProxy('usermicroservice.default.svc.cluster.local:5001'));
app.use('/login', createDynamicProxy('loginms.default.svc.cluster.local:5055'));


app.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});

const server = app.listen(5000, () => {
  console.log(`Gateway server is running on port 5000`);
});

// Export server for testing
module.exports = { app, server, createDynamicProxy };
