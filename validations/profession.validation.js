import joi from "joi";

const ProfessionValidation = joi.object({
  name: joi.string().min(2).max(32).required(),
  img: joi.string().required(),
});
const ProfessionPatchValidation = joi.object({
  name: joi.string().min(2).max(32),
  img: joi.string(),
});


export { ProfessionValidation, ProfessionPatchValidation };
