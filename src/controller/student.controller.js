import Group from "../schema/group.schema.js";
import Student from "../schema/students.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

export const create_student = async (req, res, next) => {
  try {
    const body = req.body;
    const lastGroupId = body.groups[body.groups.length - 1].group;
    const group = await Group.findOne({ _id: lastGroupId });
    if (!group || group.is_deleted) {
      throw new CustomError(
        400,
        "Bunday guruh topilmadi yoki guruh yakunlangan"
      );
    }
    let student = await Student.create({ ...body });

    group.students = student._id;
    await group.save();
    res.status(201).json({ message: "O'quvchi qo'shildi" });
  } catch (error) {
    next(error);
  }
};

export const search_group = async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name) {
      throw new CustomError(400, "name must be");
    }
    const grpup = await Group.find({
      name: { $regex: name, $options: "i" },
      is_deleted: false,
    })
      .populate("teacher")
      .populate("students");

    const resData = new ResData(200, "succses", grpup);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const get_all_students = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.first_name = { $regex: search, $options: "i" };
    }
    const students = await Student.find(filter);
    const result = search && !students.length ? [] : students;
    const resData = new ResData(200, "sucsses", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(Error);
  }
};
