import joi from "joi";

const SubjectValidation = joi.object({
  name: joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required(),
  img: joi.string().required(),
});
const SubjectPatchValidation = joi.object({
  name: joi.string().pattern(/^[a-zA-Z0-9\s]+$/),
  img: joi.string(),
});


export { SubjectValidation, SubjectPatchValidation };

