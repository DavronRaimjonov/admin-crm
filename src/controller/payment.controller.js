import dayjs from "dayjs";
import Student from "../schema/students.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

export const get_debtors_student = async (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      throw new CustomError(
        400,
        "month query parametresi majburiy: ?month=2025-05"
      );
    }
  } catch (error) {
    next(error);
  }
};

export const create_payment_student = async (req, res, next) => {
  try {
    const body = req.body;

    const student = await Student.findOne({ _id: body.student_id });
    if (!student) {
      throw new CustomError(400, "Student topilmadi");
    }

    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!monthRegex.test(body.month)) {
      throw new CustomError(
        400,
        "month noto‘g‘ri formatda. YYYY-MM formatda bo‘lishi kerak (masalan: 2025-05)."
      );
    }

    const formattedMonth = dayjs(body.month).format("YYYY-MM");

    await student.save();

    res.status(201).json({ message: "To‘lov muvaffaqiyatli qo‘shildi" });
  } catch (error) {
    next(error);
  }
};
