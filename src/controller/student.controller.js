import Group from "../schema/group.schema.js";
import Student from "../schema/students.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";
import dayjs from "dayjs";

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
    const students = await Student.find(filter).populate({
      path: "groups.group",
    });

    const result = search && !students.length ? [] : students;
    const resData = new ResData(200, "sucsses", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(Error);
  }
};
export const get_one_student = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new CustomError(400, "Id  must be");
    }
    const student = await Student.findOne({ _id: id })
      .select("-password")
      .populate({
        path: "groups.group",
        select: "-students",
      });

    if (!student) {
      throw new CustomError(400, "Teacher not found");
    }
    const resData = new ResData(200, "succses", student);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const added_new_group_student = async (req, res, next) => {
  try {
    const { student_id, group_id, joinedAt } = req.body;

    if (!group_id || !joinedAt || !student_id)
      throw new CustomError(400, "group_id or joinedAt studnet_id must be");
    const student = await Student.findOne({ _id: student_id });
    if (!student || student.is_deleted)
      throw new CustomError(
        400,
        "Student topilmadi yoki student o'quv markazni tark etkan "
      );
    if (
      student.groups.filter((value) => value.status === "aktiv").length >= 4
    ) {
      throw new CustomError(400, "Bir o'quvchi faqat 4 ta guruhda o'qiy oladi");
    }
    if (student.status === "ta'tilda")
      throw new CustomError(
        400,
        "Ta'tildagi o'quvchini guruhga biriktirib bo'lmaydi"
      );
    const group = await Group.findOne({ _id: group_id });
    if (!group || group.is_deleted) {
      throw new CustomError(
        400,
        "Bunday guruh topilmadi yoki guruh yakunlangan"
      );
    }
    if (
      student.groups.find(
        (value) =>
          value.group.toString() === group_id && value.status === "aktiv"
      )
    ) {
      throw new CustomError(400, "O'quvchi allaqachon bu guruhda mavjud");
    }
    const newGroup = {
      group: group_id,
      joinedAt: joinedAt,
      status: "aktiv",
      exitedAt: null,
      payments: [],
    };

    student.groups.push(newGroup);
    group.students.push(student._id);

    await student.save();
    await group.save();
    res
      .status(201)
      .json({ message: "O'quvchi yangi guruhga qoshildi!", student });
  } catch (error) {
    next(error);
  }
};
export const deleted_student = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) throw new CustomError(400, "_id must be");
    const student = await Student.findOne({ _id });
    if (!student || student.is_deleted)
      throw new CustomError(
        400,
        "O'quvchi topilmadi yoki allaqachon markazdan chiqib ketkan"
      );
    student.is_deleted = true;
    student.status = "yakunladi";
    student.groups = student.groups.map((value) => {
      return { ...value, exitedAt: new Date(), status: "chiqdi" };
    });
    await student.save();
    res.status(200).json({ message: "O'quvchi markazdan chiqarilid", student });
  } catch (error) {
    next(error);
  }
};

export const return_student = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) throw new CustomError(400, "_id must be");
    const student = await Student.findOne({ _id });
    if (!student || !student.is_deleted)
      throw new CustomError(
        400,
        "O'quvchi topilmadi yoki allaqachon aktiv xolatda"
      );

    student.is_deleted = false;
    student.status = "faol";

    await student.save();

    res.status(200).json({ message: "O'quvchi markazga qaytarildi", student });
  } catch (error) {
    next(error);
  }
};

export const leave_student = async (req, res, next) => {
  try {
    const { student_id, leave_days, reason } = req.body;
    if (!student_id || !leave_days || !reason)
      throw new CustomError(400, "student_id leave_days, reason majburiy");
    const student = await Student.findOne({ _id: student_id });
    if (!student || student.is_deleted)
      throw new CustomError(
        400,
        "O'quvchi topilmadi yoki o'quvchi markazni tark etkan"
      );
    if (student.status === "ta'tilda")
      throw new CustomError(400, "O'quvchi allaqachon ta'tilga yuborilgan");
    student.status = "ta'tilda";
    student.groups.forEach((group) => {
      group.exitedAt = new Date();
      group.status = "chiqdi";
    });

    const startDate = dayjs().startOf("day"); // bugun
    const endDate = startDate.add(leave_days, "day");

    student.leave_history.push({
      start_date: startDate.toDate(),
      end_date: endDate.toDate(),
      days: Number(leave_days),
      reason: reason,
    });

    await student.save();
    res.status(200).json({
      message: `O'quvchi vaqtincha ${leave_days} ta'tilga chiqarildi`,
      student,
    });
  } catch (error) {
    next(error);
  }
};

export const return_leave_student = async (req, res, next) => {
  try {
    const { student_id } = req.body;
    if (!student_id) throw new CustomError(400, "student_id must be");
    const student = await Student.findOne({ _id: student_id });
    if (!student || student.is_deleted)
      throw new CustomError(
        400,
        "O'quvchi topilmadi yoki o'quvchi markazni tark etkan"
      );
    if (student.status === "faol")
      throw new CustomError(400, "O'quvchi allaqachon faol");

    const lastLeave = student.leave_history[student.leave_history.length - 1];
    if (lastLeave) {
      lastLeave.end_date = dayjs().toDate();
      lastLeave.days = dayjs(lastLeave.end_date).diff(
        dayjs(lastLeave.start_date),
        "day"
      );
    }
    student.status = "faol";
    await student.save();
    res
      .status(200)
      .json({ message: "O'quvchi vaqtincha ta'tildan qaytarilid", student });
  } catch (error) {
    next(error);
  }
};
