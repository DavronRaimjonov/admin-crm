import Joi from "joi";

export const createGroupValidation = Joi.object({
  name: Joi.string().required(),
  teacher: Joi.string().required(),
  started_group: Joi.date().required(),
}).required();
