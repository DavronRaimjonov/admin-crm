import Joi from "joi";

export const createAuthValidator = Joi.object({
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
}).required();
export const editAuthValidator = Joi.object({
  _id: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid("faol", "ta'tilda").optional(),
}).required();
export const editProfileValidator = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
}).required();
export const leaveStaffValidator = Joi.object({
  _id: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
  reason: Joi.string().required(),
}).required()
