const User = require('../loginms/models');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const express = require('express')  

//express App
const app = express()
const PORT = 5055
const amqp = require('amqplib')
const QUEUE_SEND = "Login_User_SendQueue"
const QUEUE_RECIEVE = "User_Login_RecieveQueue"
const RabbitURL = "10.244.0.17"


async function connectToRabbitMQ(queueInput) {
    try{
        const connection = await amqp.connect({host:RabbitURL, port: 5672});
    }catch(error)
    {
        console.error(error)
    }
    const channel = await connection.createChannel();
    const queue = queueInput
    await channel.assertQueue(queue)
    return channel
}
//Recieve data from recieve queue
async function ConsumeMessage() {
    try {
        const queue = QUEUE_RECIEVE;
        const channel = await connectToRabbitMQ(queue);
        
        console.log("Login-Microservice waiting to recieve messages in queue");
        channel.consume(queue, async (message) => {
            try {
                const content = message.content;
                return content
            } catch (error) {
                console.error(error);
            }
        });
    } catch (error) {
        console.error(error);
    }
}

const loginUser = async (req, res) => {
    try {
       
        const { email, password } = req.body;
        const messageQueue = await connectToRabbitMQ(QUEUE_SEND)

        //Sending a 'Get-User' to User Microservice and included email to check
        await messageQueue.sendToQueue(QUEUE_SEND,Buffer.from(JSON.stringify(req.body)))
        const response = await Json.stringify(ConsumeMessage())

        if(response.status == 200)
        {
            const token = jwt.sign({email},process.env.KEY,{expiresIn:'1h'})
            return res.status(200).json({ message: "Successfully logged in!",token:token});
        }
        else if(response.body.password != req.body.password)
        {
            return res.status(404).json({ error: 'Password' });
        }
        else if(response.status == 404)
        {
            console.log("Didnt find by email");
            return res.status(404).json({ error: 'Email' });
        }
        
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

//MiddleWare
app.use(express.json())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

app.post("/",loginUser)

// Only start the server if this file is run directly (not required by another file)
if (require.main === module) {
    try {
        app.listen(PORT, () => {
            console.log(`Server listening at ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    connectToRabbitMQ,
    ConsumeMessage,
    app
}