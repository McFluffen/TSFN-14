const axios = require('axios');

function validateFirstname(firstname) {
    // Custom validation logic here
    return (firstname !== "");
  }

function validateLastname(lastname) {
    // Custom validation logic here
    return (lastname !== "");
}
  
function validateEmail(email) {
    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //returns true if success or false if not
    return emailValidation.test(email);
}

async function existingEmailCheck(email) {
  //can be used for creating accounts and log in
  try {
      //we can use the response later for logging in if needed
      //RabbitMQ
      const response = await axios.get(`http://20.76.217.223/users/${email}`)
      console.log("User exists");
      return true;
  } catch(error) {
    //If we get an error, the user was not found, create the account
    const serverError = error.response.data.error;
    console.log("User doesnt exist");
    if (serverError === 'User not found'){
      return false;
    }
  }
}

function validatePassword(password, passwordConfirm) {
    return (password === passwordConfirm);
}
  
  module.exports = {
    validateFirstname,
    validateLastname,
    validateEmail,
    validatePassword,
    existingEmailCheck,
    // Add more validation functions as needed
  };