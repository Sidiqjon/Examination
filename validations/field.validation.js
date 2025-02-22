import joi from "joi";

const FieldValidation = joi.object({
  name: joi.string().min(2).max(32).pattern(/^[a-zA-Z0-9\s]+$/).required(),
  img: joi.string().required(),
  professionId: joi.number().positive().default(null),
  subjectId: joi.number().positive().default(null)
});

const FieldPatchValidation = joi.object({
  name: joi.string().min(2).max(32).pattern(/^[a-zA-Z0-9\s]+$/),
  img: joi.string(),
  professionId: joi.number().positive().default(null),
  subjectId: joi.number().positive().default(null)
});

export { FieldValidation, FieldPatchValidation };

