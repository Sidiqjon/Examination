import joi from "joi";

const SubjectValidation = joi.object({
  name: joi.string().required(),
  img: joi.string().required(),
});
const SubjectPatchValidation = joi.object({
  name: joi.string(),
  img: joi.string(),
});


export { SubjectValidation, SubjectPatchValidation };
