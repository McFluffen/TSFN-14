const express = require('express')
const app = express()
const PORT = 5000;

const axios = require('axios')

//Routes definitions
app.get('/events', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5001' , {
        // Request to Service 1: API 1
      params: req.query });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error communicating with API 1' });
    }
  });

<<<<<<< HEAD
// Define the login route and forward requests to the corresponding microservice
app.get('/api/login', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3001/api/login'); // Request to Service 1: API login
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Error communicating with API login' });
    }
});

//Calender Routes

//User Routes
=======
>>>>>>> 17729a1b5c5bb43e996072f2e7513abc5949f9b3

  
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