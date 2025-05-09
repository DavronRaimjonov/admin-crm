import Category from "../schema/course-cateogry.schema.js";
import Course from "../schema/course.schema.js";
import Group from "../schema/group.schema.js";
import Teacher from "../schema/techer.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";

export const search_course = async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) {
      const categories = await Category.find({
        name: { $regex: search, $options: "i" },
      });
      const categoryIds = categories.map((cat) => cat._id);
      filter = {
        name: { $in: categoryIds },
      };
    }

    let courses = await Course.find(filter).populate("name");
    const resData = new ResData(200, "succses", courses);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const create_group = async (req, res, next) => {
  try {
    const { teacher: teacherId, course_id, ...rest } = req.body;

    if (rest.name) {
      throw new CustomError(
        400,
        "Group nomi avtomatik yaratiladi, qo‘lda berib bo‘lmaydi"
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new CustomError(400, "Ustoz topilmadi");
    }

    const course = await Course.findById(course_id).populate("name");
    if (!course) {
      throw new CustomError(400, "Course topilmadi");
    }
    const courseName = course.name.name;

    const groupCount = await Group.countDocuments({ course: course_id });

    const groupName = `${courseName} N${groupCount + 1}`;

    const newGroup = await Group.create({
      ...rest,
      teacher: teacherId,
      course: course_id,
      name: groupName,
      price: course.price,
    });

    teacher.groups.push(newGroup._id);
    await teacher.save();

    const populatedGroup = await Group.findById(newGroup._id)
      .populate({
        path: "teacher",
        select: "first_name last_name email phone field status",
      })
      .populate({
        path: "course",
        populate: { path: "name", select: "name" },
      });

    // 9) Javobni yuborish
    res.status(200).json(new ResData(200, "succses", populatedGroup));
  } catch (error) {
    next(error);
  }
};

export const get_all_group = async (req, res, next) => {
  try {
    const { is_deleted, search } = req.query;
    let filter = {};

    if (is_deleted !== undefined) {
      filter.is_deleted = is_deleted === "true";
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    console.log(filter);
    const groups = await Group.find(filter)
      .populate("teacher")
      .populate("students");
    const result = search && !groups.length ? [] : groups;
    const resData = new ResData(200, "status", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const get_one_group = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) throw new CustomError(400, "id must be");

    const group = await Group.findOne({ _id: id })
      .populate("teacher")
      .populate("students");

    if (!group) throw new CustomError(400, "Guruh topilmadi");

    const resData = new ResData(200, "succses", group);

    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const search_teacher = async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name) {
      throw new CustomError(400, "name must be");
    }
    const teachers = await Teacher.find({
      first_name: { $regex: name, $options: "i" },
    });

    const resData = new ResData(200, "succses", teachers);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const edit_end_group = async (req, res, next) => {
  try {
    const { _id, date } = req.body;
    if (!_id || !date) throw new CustomError(400, "_id or date must be");
    const group = await Group.findOne({ _id });

    if (group.is_deleted) {
      throw new CustomError(
        400,
        "Guruh tugallangan vaqtni o'zgartira olmaysiz !"
      );
    }

    if (!group) throw new CustomError(400, "Gruh topilmadi");
    group.end_group = date;
    await group.save();

    res.status(200).json({ message: "Guruh tugash vaqti o'zgartrildi", group });
  } catch (error) {
    next(error);
  }
};
export const end_group = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) throw new CustomError(400, "_id must be");
    const group = await Group.findOne({ _id });
    if (!group) throw new CustomError(400, "Guruh topilmadi");
    if (group.is_deleted) {
      throw new CustomError(400, "Guruh allaqachon o'chirilgan !");
    }
    group.is_deleted = true;
    group.end_group = new Date();
    group.save();
    res.status(200).json({ message: "Guruh yakunlandi", group });
  } catch (error) {
    next(error);
  }
};

export const edit_price_group = async (req, res, next) => {
  try {
    const { group_id, price } = req.body;
    if (!group_id || !price)
      throw new CustomError(400, "group_id yoki price majburiy");
    const group = await Group.findOne({ _id: group_id });
    if (!group) throw new CustomError(400, "Guruh topilmadi");
    if (group.is_deleted || group.disable)
      throw new CustomError(400, "Guruh yakunlangan");

    group.price = price;
    await group.save();

    const resData = new ResData(200, "Guruh narxi o'zgartrildi", group);

    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
