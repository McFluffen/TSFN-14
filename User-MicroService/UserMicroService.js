const express = require('express');
const app = express();
const {getUser,createUser,updateUser,getAllUsers} = require("../User-MicroService/UserFunctions")
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 5001


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


