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

    let updateAdmin = await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { ...user } },
      {
        new: true,
      }
    ).select("-password");
    if (!updateAdmin) {
      throw new CustomError(404, "Admin topilmadi");
    }
    const resData = new ResData(200, "Admin yangilandi", updateAdmin);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const getAllManagers = async (req, res, next) => {
  try {
    const managers = await User.find({ role: "manager" }).select("-password");
    const resData = new ResData(200, "succses", managers);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const getAllAdmins = async (req, res, next) => {
  try {
    const managers = await User.find({ role: "admin" }).select("-password");
    const resData = new ResData(200, "succses", managers);
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
