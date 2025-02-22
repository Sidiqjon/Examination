import Joi from 'joi';

const RegionValidation = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required()
});

const RegionPatchValidation = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/)
});

export { RegionValidation, RegionPatchValidation };
