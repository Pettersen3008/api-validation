//Validation
const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(4).max(30).required().error(new Error('Brukernavn må ha minst 4 karakterer')),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required().error(new Error('Passord må ha minst 6 karakterer')),
        repeatPassword: Joi.ref('password')
    });
    return schema.validate(data);
}

// Login Validation
const loginValidation = data  => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;