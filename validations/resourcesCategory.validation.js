import joi from "joi";

const ResourcesCategoryValidation = joi.object({
  name: joi.string().required(),
  img: joi.string().required(),
});

const ResourcesCategoryPatchValidation = joi.object({
  name: joi.string(),
  img: joi.string(),
});

export { ResourcesCategoryValidation, ResourcesCategoryPatchValidation };
