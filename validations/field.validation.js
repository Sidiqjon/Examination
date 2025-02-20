import joi from "joi";

const FieldValidation = joi.object({
  name: joi.string().min(2).max(32).required(),
  img: joi.string().required(),
  professionId: joi.number().positive().default(null),
  subjectId: joi.number().positive().default(null)
});

const FieldPatchValidation = joi.object({
  name: joi.string().min(2).max(32),
  img: joi.string(),
  professionId: joi.number().positive(),
  subjectId: joi.number().positive()  
});

export { FieldValidation, FieldPatchValidation };
