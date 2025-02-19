import joi from "joi";

const FieldValidation = joi.object({
  name: joi.string().required(),
  img: joi.string().required(),
  professionId: joi.number().positive().default(null),
  subjectId: joi.number().positive().default(null)
});

const FieldPatchValidation = joi.object({
  name: joi.string(),
  img: joi.string(),
  professionId: joi.number().positive(),
  subjectId: joi.number().positive()
});

export { FieldValidation, FieldPatchValidation };
