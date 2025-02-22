import joi from "joi";

const LikeValidation = joi.object({
  userId: joi.number().positive().required(),
  learningCenterId: joi.number().positive().required(),
});


export { LikeValidation };

