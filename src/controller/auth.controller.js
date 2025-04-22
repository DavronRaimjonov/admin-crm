import User from "../schema/auth.schmea.js";
import { genereteJwt, hashPassword } from "../utils/jwt.js";
import { CustomError, ResData } from "../utils/responseHelpers.js";
import bcrypt from "bcrypt";

export const sign_in = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new CustomError(400, "Email or password must be");

    const findUser = await User.findOne({ email });
    if (!findUser.active) {
      throw new CustomError(400, "Email or password must be");
    }
    const isMatchPAssword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPAssword) throw new CustomError(400, "Email or password wrong");
    let token = genereteJwt({ id: findUser.id }, res);
    const userData = findUser.toObject();
    delete userData.password;
    const resData = new ResData(200, "succses", {
      ...userData,
      token,
    });

    res.status(resData.status).json({ ...resData });
  } catch (error) {
    next(error);
  }
};
