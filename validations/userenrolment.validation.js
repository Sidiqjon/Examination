import Joi from "joi";

const userEnrolmentValidation = Joi.object({
  userId: Joi.number().required(), 
  branchId: Joi.number().default(null),
  learningCenterId: Joi.number().default(null)
});

const userEnrolmentPatchValidation = Joi.object({
  branchId: Joi.number().positive().default(null),
  learningCenterId: Joi.number().positive().default(null)
});

export { userEnrolmentValidation, userEnrolmentPatchValidation };
