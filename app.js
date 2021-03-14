// Requied Imports
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();
dotenv.config();

// DB CONNECTION
mongoose.connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, 
    () => console.log('Database connected')
);

//Middelwares
app.use(express.json());

// Route Middelwares
app.use('/api/user', authRoute);
app.use('api/posts', postRoute);

// Constant
port = process.env.PORT || 3000
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
})