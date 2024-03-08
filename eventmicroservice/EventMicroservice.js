const express = require('express');
const app = express();
const {getUserEvents, getUserEventsTime,createEvent, updateEvent, deleteEvent} = require('./Eventfunctions')
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = 5002


// Middleware to log incoming requests
app.use(express.json());
app.use(cors())

app.use((req, res,next) => {
    console.log(req.path, req.method);
    next();
});

//Routing 
app.get('/event/:id/:date',getUserEvents)
app.get('/event/:id/:date/:time',getUserEventsTime)
app.post('/event',createEvent)
app.patch('/event/:id/:date/:time',updateEvent)
app.delete('/event/:id/:date/:time', deleteEvent)


mongoose.connect("mongodb+srv://eventDB:o5tjTk5a1qUASHN2@event.pthdyde.mongodb.net/eventDB?retryWrites=true&w=majority")

    .then(() => {
        app.listen(PORT,() => console.log(`Database has been accessed successfully on ${PORT}`))
        })
    .catch((error) =>{console.log(error)})


