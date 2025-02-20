import Joi from "joi";

const BranchValidation = Joi.object({
  name: Joi.string().min(2).required(),
  phoneNumber: Joi.string().min(13).max(13).pattern(/^\+998\d{9}$/).required(),
  img: Joi.string().required(),
  address: Joi.string().required(),
  regionId: Joi.number().required(),
  learningCenterId: Joi.number().required(),
});

const BranchPatchValidation = Joi.object({
  name: Joi.string().min(2),
  phoneNumber: Joi.string().min(13).max(13).pattern(/^\+998\d{9}$/),
  img: Joi.string(),
  address: Joi.string(),
  regionId: Joi.number(),
  learningCenterId: Joi.number(),
});

export { BranchValidation, BranchPatchValidation };
