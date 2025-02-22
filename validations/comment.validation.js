import Joi from 'joi';

const createCommentValidation = Joi.object({
  comment: Joi.string().min(1).required(),
  star: Joi.number().precision(1).min(0).max(5.0).required(),
  learningCenterId: Joi.number().positive().required(),
  userId: Joi.number().positive().required()
});

const updateCommentValidation = Joi.object({
  comment: Joi.string().min(1),
});
export { createCommentValidation,updateCommentValidation };
