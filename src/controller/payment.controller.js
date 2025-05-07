import Student from "../schema/students.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

export const show_payment_student = async (req, res, next) => {
  try {
    const { student_id } = req.body;
    if (!student_id) throw new CustomError(400, "student_id must be");
    const student = await Student.findOne({ _id: student_id }).populate({
      path: "groups.group",
    });

    if (!student || !student.groups) {
      throw new CustomError(404, "Student yoki guruhlar topilmadi");
    }

    student.all_price_group = student.groups.reduce((acc, value) => {
      if (value.status === "aktiv" && value.group?.price) {
        acc += value.group.price;
      }
      return acc;
    }, 0);

    await student.save();
    const resData = new ResData(200, "succses", student);

    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const create_payment_student = () => {
  try {
  } catch (error) {}
};
