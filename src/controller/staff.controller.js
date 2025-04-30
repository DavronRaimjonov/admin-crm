import User from "../schema/auth.schmea.js";
import { hashPassword } from "../utils/jwt.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";
export const create_manager = async (req, res, next) => {
  try {
    const user = req.body;
    const findUser = await User.findOne({ email: user.email });
    if (findUser) throw new CustomError(403, "Email already exists");
    let password = await hashPassword(user.password);
    await User.create({ ...user, password });
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};
export const create_admin = async (req, res, next) => {
  try {
    const user = req.body;
    const findUser = await User.findOne({ email: user.email });
    if (findUser) throw new CustomError(403, "Email already exists");
    let password = await hashPassword(user.password);
    await User.create({ ...user, password });
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};

export const edited_admin = async (req, res, next) => {
  try {
    const user = req.body;

    if (!user._id) {
      throw new CustomError(400, "_id must be");
    }
    const existingUser = await User.findById(user._id).select("role");
    if (!existingUser) {
      throw new CustomError(404, "Xodim topilmadi");
    }
    if (existingUser.role !== "admin") {
      throw new CustomError(403, "Faqat admin o'zgartiriladi");
    }
    const updateAdmin = await User.findByIdAndUpdate(
      user._id,
      { $set: { ...user } },
      { new: true }
    ).select("-password");

    const resData = new ResData(200, "Xodim yangilandi", updateAdmin);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const edited_manager = async (req, res, next) => {
  try {
    const user = req.body;

    if (!user._id) {
      throw new CustomError(400, "_id must be");
    }
    const existingUser = await User.findById(user._id).select("role");
    if (!existingUser) {
      throw new CustomError(404, "Xodim topilmadi");
    }
    if (existingUser.role !== "manager") {
      throw new CustomError(403, "Faqat manager o'zgartiriladi");
    }
    const updateAdmin = await User.findByIdAndUpdate(
      user._id,
      { $set: { ...user } },
      { new: true }
    ).select("-password");

    const resData = new ResData(200, "Xodim yangilandi", updateAdmin);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const getAllManagers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { role: "manager" };

    if (status) {
      filter.status = status;
    }

    const managers = await User.find(filter).select("-password");
    const result = status && !managers.length ? [] : managers;
    const resData = new ResData(200, "success", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const getAllAdmins = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let filter = { role: "admin" };

    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.first_name = { $regex: search, $options: "i" };
    }

    const admins = await User.find(filter).select("-password");
    const result = search && !admins.length ? [] : admins;
    const resData = new ResData(200, "success", result);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const findOneUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new CustomError(400, "Id  must be");
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new CustomError(400, "User not found");
    }
    const resData = new ResData(200, "succses", user);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const getDeletedWorks = async (req, res, next) => {
  try {
    const managers = await User.find({ is_deleted: true }).select("-password");
    const resData = new ResData(200, "succses", managers);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const deleted_admin = async (req, res, next) => {
  try {
    const user = req.body;

    if (!user._id) {
      throw new CustomError(400, "_id must be");
    }

    await User.findByIdAndUpdate(user._id, {
      $set: {
        is_deleted: true,
        status: "ishdan bo'shatilgan",
        active: false,
        work_end: Date.now(),
      },
    });
    res.status(200).json({ message: "Admin ishdan bo'shatilidi" });
  } catch (error) {
    next(error);
  }
};

export const leave_staff = async (req, res, next) => {
  try {
    const body = req.body;

    const user = await User.findOne({ _id: body._id });
    if (user.is_deleted) {
      throw new CustomError(
        400,
        "Ishdan bo'shatilgan xodimni ta'tilga chiqarib bo'lmaydi."
      );
    }

    await User.findByIdAndUpdate(body._id, {
      $push: {
        leave_history: {
          start_date: body.start_date,
          end_date: body.end_date,
          reason: body.reason,
        },
      },
      $set: {
        active: false,
        status: "ta'tilda",
      },
    });

    res.status(200).json({ message: "Admin ta'tilga yuborildi" });
  } catch (error) {
    next(error);
  }
};

export const leave_exit_staff = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || !body._id) {
      throw new CustomError(400, "Id majburiy");
    }

    const user = await User.findById(body._id);
    if (!user) {
      throw new CustomError(404, "Foydalanuvchi topilmadi");
    }

    if (user.status !== "ta'tilda") {
      throw new CustomError(
        400,
        "Foydalanuvchi ishdan bo'shatilgan yoki ta'tilda emas"
      );
    }

    user.active = true;
    user.status = "faol";

    if (user.leave_history && user.leave_history.length > 0) {
      const lastLeave = user.leave_history[user.leave_history.length - 1];
      if (lastLeave) {
        lastLeave.end_date = new Date();
        user.markModified("leave_history");
      }
    }

    await user.save();

    res.json({ message: "Foydalanuvchi tatildan oldin chiqarildi" });
  } catch (error) {
    next(error);
  }
};
