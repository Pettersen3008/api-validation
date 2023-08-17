// Required Imports
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

// Register User
router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).json(error.message);
    
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(400).json('Denne mailen er allerede i bruk');

    const userExist = await User.findOne({username: req.body.username})
    if(userExist) return res.status(400).json('Brukernavn er tatt');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedRepeat = await bcrypt.hash(req.body.repeatPassword, salt); 

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        repeatPassword: hashedRepeat,
    });

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
    
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const user = await User.findOne({username: req.body.username})
    if(!user) return res.status(400).json('Brukernavn eller passord er feil');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json('Brukernavn eller passord er feil');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json(token);
});

module.exports = router;
