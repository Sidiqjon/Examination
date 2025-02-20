import joi from "joi"

const LearningCenterValidation = joi.object({
    name: joi.string().min(2).required(),
    phoneNumber: joi.string().min(13).max(13).pattern(/^\+998\d{9}$/).required(),
    img: joi.string().required(),
    address: joi.string().required(),
    regionId: joi.number().positive().required(),
    branchNumber: joi.number().default(0),
    createdBy: joi.number().positive().required(),
    lcfield: joi.any(),
})

const LearningCenterPatchValidation = joi.object({
    name: joi.string().min(2),
    phoneNumber: joi.string().min(13).max(13).pattern(/^\+998\d{9}$/),
    img: joi.string(),
    address: joi.string(),
    regionId: joi.number().positive(),
    branchNumber: joi.any().default(0),
})

export {LearningCenterValidation, LearningCenterPatchValidation}
