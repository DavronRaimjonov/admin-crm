import Joi from "joi";

export const createAuthValidator = Joi.object({
  _id: Joi.string().optional(),

  first_name: Joi.string().required(),
  last_name: Joi.string().required(),

  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),

  image: Joi.string().allow(""),

  role: Joi.string().valid("admin", "manager").required(),

  work_date: Joi.date().required(),
  work_end: Joi.date().allow(null),

  active: Joi.boolean().optional(),
  status: Joi.string()
    .valid("faol", "ta'tilda", "ishdan bo'shatilgan")
    .optional(),

  last_active_date: Joi.date().optional(),
  is_deleted: Joi.boolean().optional(),
});
