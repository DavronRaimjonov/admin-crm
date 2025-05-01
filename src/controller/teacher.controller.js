import Teacher from "../schema/techer.schema.js";
import { hashPassword } from "../utils/jwt.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

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

export const get_all_teachers = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.first_name = { $regex: search, $options: "i" };
    }

    const teacher = await Teacher.find(filter).select("-password");
    const result = search && !teacher.length ? [] : teacher;
    const resData = new ResData(200, "sucsses", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
