import Joi from 'joi';

const updateRegionValidation = Joi.object({
  name: Joi.string().required()
  
});

export {  updateRegionValidation };
