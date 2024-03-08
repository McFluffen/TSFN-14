const express = require('express');
const app = express();
const {getUser,createUser,updateUser,getAllUsers} = require("./UserFunctions")
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')
const PORT = 5001
const amqp = require('amqplib')
const RabbitURL = "10.244.0.17"
const URL = "10.0.128.16"
const QUEUE_NAME = "User_Login_SendQueue"

// Middleware to log incoming requests
app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    //Implement logging of Requests here
    next();
});

//Get user
app.get('/:id',getUser)

//Create a new user
app.post('/', createUser)

//Update a user 
app.patch('/:id',updateUser)

app.get('/user', getAllUsers)


mongoose.connect("mongodb+srv://userDB:jH3ctwIUnr0nlEGr@user.q5hnsyx.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(PORT,() => console.log(`Database has been accessed successfully on ${PORT}`))
        })
    .catch((error) =>{console.log(error)})


