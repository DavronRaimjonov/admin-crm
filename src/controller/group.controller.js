import Group from "../schema/group.schema.js";
import Teacher from "../schema/techer.schema.js";
import { CustomError } from "../utils/responseHelpers.js";

export const create_group = async (req, res, next) => {
  try {
    const body = req.body;
    const teacher = await Teacher.findOne({ _id: body.teacher });
    if (!teacher) {
      throw new CustomError(400, "Ustoz topilmadi");
    }

    let group = await Group.create({ ...body });

    res.json(group);
  } catch (error) {
    next(error);
  }
};
