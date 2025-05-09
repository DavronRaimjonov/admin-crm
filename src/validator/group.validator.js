import Joi from "joi";

export const createGroupValidation = Joi.object({
  teacher: Joi.string().required(),
  course_id: Joi.string().required(),
  started_group: Joi.date().required(),
}).required();
