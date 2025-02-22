import Joi from "joi";

const userEnrolmentValidation = Joi.object({
  userId: Joi.number().positive().required(), 
  learningCenterId: Joi.number().positive().required(),
  branchId: Joi.number().positive().optional(),
});

export { userEnrolmentValidation };
