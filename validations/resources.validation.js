import joi from "joi";

const ResourcesValidation = joi.object({
  name: joi.string().required(),
  img: joi.string().required(),
  media: joi.string().required(),
  description: joi.string().required(),
  createBy: joi.number().positive().required(),
  resourcesCategoryId: joi.number().positive().required(),
});

const ResourcesPatchValidation = joi.object({
  name: joi.string(),
  img: joi.string(),
  media: joi.string(),
  description: joi.string(),
  createBy: joi.number().positive(),
  resourcesCategoryId: joi.number().positive(),
});

export { ResourcesValidation, ResourcesPatchValidation };
