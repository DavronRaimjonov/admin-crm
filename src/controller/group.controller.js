import Group from "../schema/group.schema.js";
import Teacher from "../schema/techer.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

export const create_group = async (req, res, next) => {
  try {
    const body = req.body;
    const isExist = await Group.findOne({
      name: new RegExp(`^${body.name}$`, "i"),
    }).lean();
    if (isExist) {
      throw new CustomError(400, "Bu nomdagi guruh allaqachon mavjud");
    }
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

export const get_all_group = async (req, res, next) => {
  try {
    const groups = await Group.find().populate("teacher");

    const resData = new ResData(200, "status", groups);

    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
