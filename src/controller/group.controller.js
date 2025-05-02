import Group from "../schema/group.schema.js";
import Teacher from "../schema/techer.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

export const create_group = async (req, res, next) => {
  try {
    const body = req.body;
    const teacher = await Teacher.findOne({ _id: body.teacher });
    if (!teacher) {
      throw new CustomError(400, "Ustoz topilmadi");
    }

    let group = await Group.create({ ...body });
    teacher.groups.push(group._id);
    await teacher.save();
    const resData = new ResData(200, "succses", group);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
