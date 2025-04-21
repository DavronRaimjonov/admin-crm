import User from "../schema/auth.schmea.js";
import { genereteJwt, hashPassword } from "../utils/jwt.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";
import bcrypt from "bcrypt";

export const sign_in = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new CustomError(400, "Email or password must be");

    const findUser = await User.findOne({ email }).select("-password");
    const isMatchPAssword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPAssword) throw new CustomError(400, "Email or password wrong");
    let token = genereteJwt({ id: findUser.id }, res);
    const resData = new ResData(200, "succses", {
      ...findUser.toObject(),
      token,
    });
    res.status(resData.status).json({ ...resData });
  } catch (error) {
    next(error);
  }
};
