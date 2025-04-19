import User from "../schema/auth.schmea.js";
import { genereteJwt, hashPassword, sendTokenAsCookie } from "../utils/jwt.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";
import bcrypt from "bcrypt";

export const sign_in = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new CustomError(400, "Email or password must be");

    const findUser = await User.findOne({ email });
    const isMatchPAssword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPAssword) throw new CustomError(400, "Email or password wrong");
    let token = genereteJwt({ id: findUser.id });
    sendTokenAsCookie(res, token);
    const resData = new ResData(200, "succses", findUser);
    res.status(resData.status).json({ ...resData });
  } catch (error) {
    next(error);
  }
};

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
