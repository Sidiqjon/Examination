import joi from "joi";

const ResourcesCategoryValidation = joi.object({
  name: joi.string().min(2).pattern(/^[a-zA-Z0-9\s]+$/).required(),
  img: joi.string().required(),
});

const ResourcesCategoryPatchValidation = joi.object({
  name: joi.string().min(2).pattern(/^[a-zA-Z0-9\s]+$/),
  img: joi.string(),
});

export { ResourcesCategoryValidation, ResourcesCategoryPatchValidation };
