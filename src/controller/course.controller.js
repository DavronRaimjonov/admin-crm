import Category from "../schema/course-cateogry.schema.js";
import Course from "../schema/course.schema.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";
export const add_category = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new CustomError(400, "name must be");
    }
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new CustomError(400, "Bunday nomdagi kategoriya allaqachon mavjud");
    }
    const newCategory = await Category.create({ name });
    const resData = new ResData(
      201,
      "Kategoriya muvaffaqiyatli qo‘shildi",
      newCategory
    );
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const create_course = async (req, res, next) => {
  try {
    const body = req.body;

    const category = await Category.findOne({ name: body.name });

    if (!category) {
      throw new CustomError(400, "Bunday nomdagi course yaratilmagan ");
    }

    const existingCourse = await Course.findOne({ name: category._id });
    if (existingCourse) {
      throw new CustomError(400, "Bunday nomdagi kurs mavjud");
    }
    let course = await Course.create({
      description: body.description,
      price: body.price,
      duration: body.duration,
      name: category._id,
    });

    course = await Course.findById(course._id).populate("name");

    const resData = new ResData(201, "succses", course);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const get_courses = async (req, res, next) => {
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

export const edit_course = async (req, res, next) => {
  try {
    const { course_id, price, duration } = req.body;

    if (!course_id || !price || !duration)
      throw new CustomError(400, "course_id, price, duration must be");
    const course = await Course.findOne({ _id: course_id });
    if (!course) throw new CustomError(400, "Kurs topilmadi");

    course.price = price;
    course.duration = duration;
    await course.save();

    const resData = new ResData(200, "Kurs o'zgrtrildi", course);

    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const delete_course = async (req, res, next) => {
  try {
    const { course_id } = req.body;
    if (!course_id) throw new CustomError(400, "course_id must be");
    let course = await Course.findOne({ _id: course_id });
    if (!course) throw new CustomError(400, "Kurs topilmadi");
    await Course.deleteOne({ _id: course_id });
    res.status(200).json({ message: "Kurs o'chirildi" });
  } catch (error) {
    next(error);
  }
};
