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

export const search_student = async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Iltimos, name query parameterni yuboring." });
    }
    const students = await Student.find({
      first_name: { $regex: name, $options: "i" },
    });

    const resData = new ResData(200, "sucsess", students);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const create_payment_student = async (req, res, next) => {
  try {
    const body = req.body;

    const student = await Student.findOne({ _id: body.student_id }).populate(
      "groups.group"
    );
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
    const groupData = student.groups.find(
      (value) =>
        (value.group?._id?.toString?.() || value.group?.toString?.()) ===
        body.group_id
    );

    if (!groupData) {
      throw new CustomError(400, "O'quvchi bunday guruhda o'qimaydi");
    }
    const paymentMonth = dayjs(body.month, "YYYY-MM");
    student.groups.map((value) => {
      if (
        (value.group._id?.toString?.() || value.group?.toString?.()) ===
        body.group_id
      ) {
        const joinedAtMonth = dayjs(value.joinedAt);
        if (paymentMonth.isBefore(joinedAtMonth, "month")) {
          throw new CustomError(
            400,
            "Guruhga qoshilgan vaqtdan boshlab to'lov qabul qilinadi."
          );
        }
      }
    });

    let filterMonth = student.groups.find(
      (value) => value.group._id.toString() === body.group_id
    );
    const totalPrice = filterMonth.payments.reduce((acc, value) => {
      if (value.month === body.month) {
        return acc + value.payment_price;
      }
      return acc; // <== bu muhim!
    }, 0);
    console.log(totalPrice);
    if (
      totalPrice >= filterMonth.group.price ||
      totalPrice + body.payment_price > filterMonth.group.price
    ) {
      const overpayAmount =
        totalPrice + body.payment_price - filterMonth.group.price;

      throw new CustomError(
        400,
        `Guruh to‘lovidan oshib ketmoqda. Siz ${overpayAmount.toLocaleString()} so‘m ortiqcha to‘lov qilmoqchisiz.`
      );
    }
    console.log(filterMonth.group.price);
    student.groups = student.groups.map((value) => {
      if (
        (value.group?._id?.toString?.() || value.group?.toString?.()) ===
        body.group_id
      ) {
        value.payments.push({
          ...body,
        });
      }
      return value;
    });

    await student.save();

    res.status(201).json({ message: "To‘lov muvaffaqiyatli qo‘shildi" });
  } catch (error) {
    next(error);
  }
};
