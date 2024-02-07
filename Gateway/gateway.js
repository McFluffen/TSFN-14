const express = require('express')
const app = express()
const PORT = 5000;
const axios = require('axios')


//Routes definitions
app.get('/event', async (req, res) => {
    try {
      const request = req.query;
      const response = await axios.get(`http://localhost:5001/${request}/`)
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error communicating with Event Microservice' });
    }
  });


  
  app.get('/api2', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3002/api2'); // Request to Service 2: API 2
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error communicating with API 2' });
    }
  });
  


//Gateway Start

app.listen(PORT,() => 
{
    console.log(`API Gateway is running on ${PORT}`)
})