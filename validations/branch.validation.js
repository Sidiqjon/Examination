import Joi from "joi";

const BranchValidation = Joi.object({
  name: Joi.string().min(2).pattern(/^[a-zA-Z0-9\s]+$/).required(),
  phoneNumber: Joi.string().min(13).max(13).pattern(/^\+998\d{9}$/).required(),
  img: Joi.string().required(),
  address: Joi.string().required(),
  regionId: Joi.number().positive().required(),
  learningCenterId: Joi.number().positive().required(),
});

const BranchPatchValidation = Joi.object({
  name: Joi.string().min(2).pattern(/^[a-zA-Z0-9\s]+$/),
  phoneNumber: Joi.string().min(13).max(13).pattern(/^\+998\d{9}$/),
  img: Joi.string(),
  address: Joi.string(),
  regionId: Joi.number().positive(),
});

export { BranchValidation, BranchPatchValidation };

