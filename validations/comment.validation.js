import Joi from 'joi';

const createCommentValidation = Joi.object({
  comment: Joi.string().required(),
  star: Joi.number().precision(2).positive().required(),
  learningCenterId: Joi.number().positive().required(),
  userId: Joi.number().positive().required()
});

const updateCommentValidation = Joi.object({
  comment: Joi.string(),
  star: Joi.number().precision(2).positive(),
  learningCenterId: Joi.number().positive(),
  userId: Joi.number().positive()
});
export { createCommentValidation,updateCommentValidation };
