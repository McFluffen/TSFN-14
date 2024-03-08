const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const express = require('express')  
const app = express()
const PORT = 5055


async function FetchUserFromDB(email,password){
try{
    const user = await axios.get(`20.76.217.223/users/${email}`)
        return user
    }
catch(error){
    console.error(error)
    }
}
const loginUser = async (req, res) => {
try {       
    const { email, password } = req.body;
    const response = FetchUserFromDB(email,password)
    console.log(`${response.email} and ${response.password}`)

        if(response.status == 200){

            const token = jwt.sign({email},process.env.KEY,{expiresIn:'1h'})
                return res.status(200).json({ message: "Successfully logged in!",token:token});
        }
        else if(response.body.password != req.body.password){
            return res.status(404).json({ error: 'Password' });
        }
        else if(response.status == 404)
        {
            console.log("Didnt find by email");
                return res.status(404).json({ error: 'Email' });
        }
    } 
catch(error) {
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