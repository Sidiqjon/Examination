import joi from "joi";

const ResourcesCategoryValidation = joi.object({
  name: joi.string().min(2).required(),
  img: joi.string().required(),
});

const ResourcesCategoryPatchValidation = joi.object({
  name: joi.string().min(2),
  img: joi.string(),
});

export { ResourcesCategoryValidation, ResourcesCategoryPatchValidation };
