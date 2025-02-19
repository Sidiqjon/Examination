import joi from "joi";

const ProfessionValidation = joi.object({
  name: joi.string().required(),
  img: joi.string().required(),
});
const ProfessionPatchValidation = joi.object({
  name: joi.string(),
  img: joi.string(),
});


export { ProfessionValidation, ProfessionPatchValidation };
