import joi from "joi";

const ResourcesValidation = joi.object({
  name: joi.string().min(2).required(),
  img: joi.string().required(),
  media: joi.string().required(),
  description: joi.string().min(2).required(),
  createdBy: joi.number().positive().required(),
  resourcesCategoryId: joi.number().positive().required(),
});

const ResourcesPatchValidation = joi.object({
  name: joi.string().min(2),
  img: joi.string(),
  media: joi.string(),
  description: joi.string().min(2),
  createdBy: joi.number().positive(),
  resourcesCategoryId: joi.number().positive(),
});

export { ResourcesValidation, ResourcesPatchValidation };
