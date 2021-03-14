const router = require('express').Router();
const User = require('../models/User');
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    // Find user with token (verify)
    res.send(req.user);
});

module.exports = router;