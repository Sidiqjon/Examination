import joi from "joi";

const LcFieldValidation = joi.object({
    fieldId: joi.array().items(joi.number().positive()).required(),
    learningCenterId: joi.number().positive().required(),
});
const LcFieldPatchValidation = joi.object({
    fieldId: joi.array().items(joi.number().positive()),
    learningCenterId: joi.number().positive(),
});

export { LcFieldValidation, LcFieldPatchValidation };

