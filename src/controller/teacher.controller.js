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
    const filed = [
      "Frontend dasturlash",
      "Backend dasturlash",
      "Rus tili",
      "Ingliz tili",
    ];
    if (!filed.includes(body.field)) {
      throw new CustomError(400, "Ustoz yo'nalishi xato");
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

    const teacher = await Teacher.find(filter)
      .select("-password")
      .populate({
        path: "groups",
        populate: {
          path: "students",
        },
      });
    const result = search && !teacher.length ? [] : teacher;
    const resData = new ResData(200, "sucsses", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const get_one_taacher = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new CustomError(400, "Id  must be");
    }
    const teacher = await Teacher.findOne({ _id: id })
      .select("-password1")
      .populate({
        path: "groups",
        populate: {
          path: "students",
        },
      });
    if (!teacher) {
      throw new CustomError(400, "Teacher not found");
    }
    const resData = new ResData(200, "succses", teacher);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const fire_teacher = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) throw new CustomError(400, "_id must be");
    const teacher = await Teacher.findOne({ _id });
    if (!teacher) throw new CustomError(400, "Ustoz topilmadi");
    if (teacher.status === "ishdan bo'shatilgan")
      throw new CustomError(
        400,
        `Ustoz allaqachon ishdan bo'shatilgan ${teacher.work_end}`
      );
    teacher.is_deleted = true;
    teacher.status = "ishdan bo'shatilgan";
    teacher.work_end = Date.now();
    await teacher.save();
    res.status(200).json({ message: "Ustoz ishdan bo'shatildi" });
  } catch (error) {
    next(error);
  }
};

export const return_teacher_work = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      throw new CustomError(400, "_id must be");
    }
    const teacher = await Teacher.findOne({ _id });
    if (!teacher) throw new CustomError(400, "Ustoz topilmadi");
    teacher.is_deleted = false;
    teacher.status = "faol";
    teacher.work_date = Date.now();
    teacher.work_end = null;

    await teacher.save();
    res.status(200).json({ message: "Ustoz ishga qaytarildi" });
  } catch (error) {
    next(error);
  }
};
