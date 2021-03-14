// Required Imports
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

// Register User
router.post('/register', async (req, res) => {
    // Lets validate the data before we add a user
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).json(error.message);
    
    // Checking if the email already is in the database
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).json('Denne mailen er allerede i bruk');

    // Checking if the username already is in the database
    const userExist = await User.findOne({username: req.body.username})
    if(userExist) return res.status(400).json('Brukernavn er tatt');

    // Hasing the password with encryption (Easy to hack if you can it)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedRepeat = await bcrypt.hash(req.body.repeatPassword, salt); 

    // Creating the user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        repeatPassword: hashedRepeat,
    });

    // Try to save the user if not sends back error
    try { 
        const savedUser = await user.save();
        console.log(savedUser)
        res.json({user: user._id});
    } catch(err) {
        res.status(400).json(err);
    }
});

// Login User
router.post('/login', async (req, res) => {
    // Lets validate the data before we add a user
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    // Checking if the username already is in the database
    const user = await User.findOne({username: req.body.username})
    if(!user) return res.status(400).json('Brukernavn eller passord er feil');

    // Checking if user and password match
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json('Brukernavn eller passord er feil');

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json(token);
});

module.exports = router;