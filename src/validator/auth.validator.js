import Joi from "joi";

export const createAuthValidator = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  work_date: Joi.string().required(),
});
