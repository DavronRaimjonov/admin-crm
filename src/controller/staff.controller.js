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

export const getAllManagers = async (req, res, next) => {
  try {
    const managers = User.find({ role: "manager" });
    const resData = new ResData(200, "succses", managers);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
export const getAllAdmins = async (req, res, next) => {
  try {
    const managers = User.find({ role: "admin" });
    const resData = new ResData(200, "succses", managers);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
