import Joi from "joi";

export const createCourseValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.string().required(),
  price: Joi.number().required(),
}).required();
