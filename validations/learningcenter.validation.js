import joi from "joi"

const LearningCenterValidation = joi.object({
    name: joi.string().required(),
    phoneNumber: joi.string().min(13).max(13).required(),
    img: joi.string().required(),
    address: joi.string().required(),
    regionId: joi.number().required(),
    branchNumber: joi.number().default(0),
    createdBy: joi.number().positive().required(),
    lcfield: joi.any(),
})

const LearningCenterPatchValidation = joi.object({
    name: joi.string(),
    phoneNumber: joi.string().min(13).max(13),
    img: joi.string(),
    address: joi.string(),
    regionId: joi.number(),
    branchNumber: joi.any().default(0),
})

export {LearningCenterValidation, LearningCenterPatchValidation}