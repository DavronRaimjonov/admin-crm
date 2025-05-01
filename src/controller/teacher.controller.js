import Teacher from "../schema/techer.schema.js";
import { hashPassword } from "../utils/jwt.js";
import { CustomError } from "../utils/responseHelpers.js";

export const create_teacher = async (req, res, next) => {
  try {
    const body = req.body;
    const techer = await Teacher.findOne({ email: body.email });
    if (techer) {
      throw new CustomError(400, "Email al ready exsist");
    }
    const password = await hashPassword(body.password);
    await Teacher.create({ ...body, password });
    res.status(201).json({ message: "Ustoz qo'shildi" });
    res.send("ok");
  } catch (error) {
    next(error);
  }
};
