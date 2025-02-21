import Joi from "joi";

const userEnrolmentValidation = Joi.object({
  userId: Joi.number().positive().required(), 
  branchId: Joi.number().positive().optional(),
  learningCenterId: Joi.number().positive().required(),
  status: Joi.string().valid("waiting", "studying", "graduated").default("studying"), 
});

const userEnrolmentPatchValidation = Joi.object({
  status: Joi.string().valid("waiting", "studying", "graduated"),
});

export { userEnrolmentValidation, userEnrolmentPatchValidation };
