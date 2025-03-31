const Joi = require('joi');

const registerValidation = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});

const bookingValidation = Joi.object({
    concertId: Joi.number().required(),
    seatNumber: Joi.string().required()
});

module.exports = {
    registerValidation,
    bookingValidation
}; 