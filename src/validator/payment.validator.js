import Joi from "joi";

export const paymentValidation = Joi.object({
  payment_price: Joi.number().required(),
  student_id: Joi.string().required(),
  month: Joi.date().required(),
  paidAt: Joi.date().required(),
  method: Joi.string().valid('naqd', 'karta').required(),
}).required();
