import joi from "joi";

const ResourcesValidation = joi.object({
  name: joi.string().min(2).pattern(/^[a-zA-Z0-9\s]+$/).required(),
  img: joi.string().required(),
  media: joi.string().required(),
  description: joi.string().min(2).required(),
  createdBy: joi.number().positive().required(),
  categoryId: joi.number().positive().required(),
});

const ResourcesPatchValidation = joi.object({
  name: joi.string().min(2).pattern(/^[a-zA-Z0-9\s]+$/),
  img: joi.string(),
  media: joi.string(),
  description: joi.string().min(2),
  categoryId: joi.number().positive(),
});

export { ResourcesValidation, ResourcesPatchValidation };
