//Models
const User = require('./Models');
const mongoose = require('mongoose')
const { validateFirstname, validateLastname, validateEmail, validatePassword, existingEmailCheck } = require('./inputValidation');


const getAllUsers = async (req, res) => {
  await User.find().select('email')
  .then(data =>{
    return res.status(200).json(data)
  })
  .catch(err => {
    return res.status(404).json({ err: 'User not found' });
  });
}

//API: Endpoint: /api/users/id 
//WHAT: Returns a user from database based on MONGO ID or email
//USE: GET localhost.../api/users/123 (for ID)
    //GET localhost.../api/users/bababoi@gmail.com

//TESTED: WORKS

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // If  not a valid id assume its an email
      const user = await User.findOne({ email: id });
      console.log("checking email in mongo")
      if (!user) {
        console.log("didnt find by email");
        return res.status(404).json({ error: 'User not found' });
      }
      console.log("found by email");
      console.log(user.email);
      return res.status(200).json(user);
    }

    // If a valid ObjectId, find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};


//API: Endpoint: /api/users/
//WHAT: Creates a user based on a POST Request
//USE: POST localhost.../api/users/

        //BODY {"email": "bababoi@gmail.com", "password": "secure"}

//TESTED: WORKS
const createUser = async (req, res) => {
  console.log(req.body);
  const { email, password, passwordConfirm, firstname, lastname, country } = req.body;
  try {
      //Some console logs for bug searching
      console.log("Before validating");

      if (!validateEmail(email)) {
        console.log("Validating email failed");
          return res.status(400).json({ error: "Email" });
      }
      if (!validatePassword(password, passwordConfirm)) {
        console.log("Validating password failed");
          return res.status(400).json({ error: "Password" });
      }
      if (!validateFirstname(firstname)) {
        console.log("Validating firstname failed");
        return res.status(400).json({ error: "Firstname" });
      }
      if (!validateLastname(lastname)) {
        console.log("Validating lastname failed");
        return res.status(400).json({ error: "Lastname" });
      }
      if(await existingEmailCheck(email)){
        console.log("Email already exists");
        return res.status(400).json({ error: "Email already exist" });
      }
      console.log("After validating");

      //Try adding the user to database
      const user = await User.create({ email, password, firstname, lastname, country });
      console.log("Added user to database");
      return res.status(200).json(user);
  }
  catch(error){
      console.log("Failed to add user to database");
      console.log("Error:", error);
      return res.status(400).json({ error: error.message });
  }
}



//API: Endpoint: /api/users/id
//WHAT: Updates a user on a PATCH reqqust 
//USE: PATCH localhost.../api/users/id 
    // PATCH localhost../api/users/bababoi@gmail.com
        //BODY {"email": "bababoi@gmail.com", "password": "secure"}

//TESTED: WORKS

const updateUser = async (req, res) => {
  const { email, password,passwordConfirm,firstname,lastname,country } = req.body;

  // Check if the provided parameter is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(email)) {
  
      if(!validatePassword(password,passwordConfirm))
      {
        return res.status(400).json({ error: "Password" });
      }

    try {
      const user = await User.findOneAndUpdate(
        { email: email }, // Match the user based on the email
        { $set: { ...req.body }})


      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User was updated' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  getAllUsers
};
