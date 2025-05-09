import Joi from "joi";

export const teacherValidation = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  course_id: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  work_date: Joi.string(),
}).required();
