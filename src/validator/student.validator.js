import Joi from "joi";
export const studentValidation = Joi.object({
  first_name: Joi.string().min(3).required(),
  last_name: Joi.string().min(3).required(),
  phone: Joi.string().min(12).required(),
  groups: Joi.array().items(
    Joi.object({
      group: Joi.string().required(),
    })
  ),
}).required();
