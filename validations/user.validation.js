import Joi from "joi"

const userValidation = Joi.object({
    firstName: Joi.string().min(2).max(32).required(),
    lastName: Joi.string().min(2).max(32).required(),
    phoneNumber: Joi.string().min(13).max(13).required(),
    email: Joi.string().required(),
    img: Joi.string().required(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string().valid("CEO", "USER").required(),
})

const userValidationAdmin = Joi.object({
    firstName: Joi.string().min(2).max(32).required(),
    lastName: Joi.string().min(2).max(32).required(),
    phoneNumber: Joi.string().min(13).max(13).required(),
    email: Joi.string().required(),
    img: Joi.string().required(),
    password: Joi.string().min(8).max(255).required(),
    role: Joi.string().valid("ADMIN").required(),
})

const userPatchValid = Joi.object({
    firstName: Joi.string().min(2).max(32),
    lastName: Joi.string().min(2).max(32),
    phoneNumber: Joi.string().min(13).max(13),
    img: Joi.string(),
    status: Joi.string().valid("ACTIVE", "INACTIVE"),
})

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+998\d{9}$/;
    if (phoneRegex.test(phoneNumber)) {
        return true;  
    } else {
        return false;  
    }
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return emailRegex.test(email);
}


function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
}

function validateName(name) {
    const nameRegex = /^[a-zA-Z]{2,32}$/;
    return nameRegex.test(name);
}

export { userValidation, userValidationAdmin, userPatchValid, validatePhoneNumber, validateEmail, validatePassword, validateName} 
