import Joi from "joi";

const userEnrolmentValidation = Joi.object({
  userId: Joi.number().required(), 
  branchId: Joi.number().default(null),
  learningCenterId: Joi.number().default(null)
});

const userEnrolmentPatchValidation = Joi.object({
  userId: Joi.number(), 
  branchId: Joi.number(),
  learningCenterId: Joi.number()
});

export { userEnrolmentValidation, userEnrolmentPatchValidation };
