import React, {useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import "./CreateAccount.css";
import countryList from '../data/countriesData';
import axios from 'axios';
import "../components/Background/background.css"
import jwt_decode from 'jwt-decode'


function ProfilePage () {

    const gatewayIP = "20.76.217.223";
    
    const [userEmail, setEmail] = useState('');
    const userDataFromAPI = useState({});
    //For firstname
    const [errorFirstName] = useState(false);
    const [userFirstName, setFirstName] = useState(userDataFromAPI ? userDataFromAPI.firstname : '');

    //for lastname
    const [errorLastName] = useState(false);
    const [userLastName, setLastName] = useState(userDataFromAPI ? userDataFromAPI.lastname : '');
    
    //for password
    const [errorPassword, setErrorPassword] = useState(false);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const handleClickShowPassword1 = () => setShowPassword1((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //For selecting country
    const [selectedCountry, setSelectedCountry] = useState(userDataFromAPI ? userDataFromAPI.country : '');

    const handleChange = (event) => {
        setSelectedCountry(event.target.value);
    };

    //GET THE USER INFO BY GETTING THE EMAIL OUT OF THE TOKEN and insert it into the axios call 
    //THIS FUNCTION DOESNT WORK AS OF NOW AS WE NEED THE TOKEN TO EXTRACT EMAIL
    useEffect(() => {

        const token = localStorage.getItem('token')
        const decodedToken = jwt_decode(token,"SuperSecretKey")
        const NameID = decodedToken.email;

        const getUserData = async () => {
            try {
                //we can use the response later for logging in if needed
                const response = await axios.get(`http://${gatewayIP}/users/${NameID}`);
                const userDataFromAPI = response.data;
                setEmail(NameID)
                setFirstName(userDataFromAPI.firstname);
                setLastName(userDataFromAPI.lastname);
                setSelectedCountry(userDataFromAPI.country);

                console.log("Success");
                return true;

            } catch(error) {
            //If we get an error, the user was not found, create the account
            const serverError = error.response.data.error;
            console.log("User doesnt exist");
            if (serverError === 'User not found'){
                return false;
            }
            }
        };

        getUserData();
    }, []);

    const userData = {
        email: userEmail,
        password: password1,
        passwordConfirm: password2,
        firstname: userFirstName,
        lastname: userLastName,
        country: selectedCountry,
    };

    const handleLogoutClick = () => {
        localStorage.clear('token');
    }

    const handleUpdateClick = async () => {
        //change this axios to go to the updateUser api instead, and more or less rewrite the updateUser call to look like createUser
        try {
            const token = localStorage.getItem('token')
        const decodedToken = jwt_decode(token,"SuperSecretKey")
        const NameID = decodedToken.email;
            console.log(NameID)
        await axios.patch(`http://${gatewayIP}/users/${NameID}`, userData)
        .then((res) => {
            console.log("Succesfully updated user.\n");
            setErrorPassword(false);
        })
        } catch(error) {
            
            const serverError = error.response.data.error;
            if (serverError === "Password") {
                setErrorPassword(true);
            }else {
                console.log("Error from axios post", error.response.data);
                setErrorPassword(false);
            }
        };
    };

    return (
        <div className="center">
        <Box
            component="form"
            sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <div className="create-account">
                <div>
                    <p>This is your profile page, you can change your information below or log out!</p>
                    <p id="required">If you wish to update your account information all fields marked with * 
                                     needs to be filled in, you do not have to change the fields you want to keep the same,
                                      enter a new or your old password!</p>
                </div>
                <div>
                <TextField
                        required
                        id="first-name"
                        placeholder="Enter firstname"
                        value={userFirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={errorFirstName}
                        helperText={errorFirstName ? "Please fill in required fields." : ""}
                    />
                </div>
                <div>
                <TextField
                        required
                        id="last-name"
                        placeholder="Enter lastname"
                        value={userLastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={errorLastName}
                        helperText={errorLastName ? "Please fill in required fields." : ""}
                    />
                </div>
                <div>
                <FormControl variant="outlined" sx={{ minWidth: 215 }}>
                    <InputLabel>Select Country</InputLabel>
                    <Select
                        value={selectedCountry}
                        onChange={handleChange}
                        label="Select Country"
                        defaultValue={userDataFromAPI.country}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {countryList.map((country, index) => (
                    <MenuItem key={index} value={country}>
                        {country}
                    </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </div>
                <div>
                    <TextField
                        required
                        id="outlined-adornment-password1"
                        label="Password"
                        type={showPassword1 ? "text" : "password"}
                        value={password1}
                        onChange={(e) => setPassword1(e.target.value)}
                        error={errorPassword}
                        helperText={errorPassword ? "Passwords don't match." : ""}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword1}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword1 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                    />
                </div>
                <div>
                    <TextField
                        required
                        id="outlined-adornment-password2"
                        label="Password"
                        type={showPassword2 ? "text" : "password"}
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        error={errorPassword}
                        helperText={errorPassword ? "Passwords don't match." : ""}
                        InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword2}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword2 ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                    />
                </div>
                <div>
                    <Button onClick={handleUpdateClick} variant="outlined">
                        Update!
                    </Button>
                    <Button onClick={handleLogoutClick} variant="outlined">
                        Logout!
                    </Button>
                </div>
            </div>
        </Box>
        </div>
    );
}

export default ProfilePage;