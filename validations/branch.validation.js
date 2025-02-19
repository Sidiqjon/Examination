import joi from "joi";

const BreanchValidation = joi.object({
  name: joi.string().required(),
  phoneNumber: joi.string().min(13).max(13).required(),
  img: joi.string().required(),
  address: joi.string().required(),
  regionId: joi.number().required(),
  learningCenterId: joi.number().required(),
});

const BranchPatchValidation = joi.object({
  name: joi.string(),
  phoneNumber: joi.string().min(13).max(13),
  img: joi.string(),
  address: joi.string(),
  regionId: joi.number(),
  learningCenterId: joi.number(),
});

export { BreanchValidation, BranchPatchValidation };
