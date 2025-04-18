import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const genereteJwt = (params, res) => {
  const token = jwt.sign(params, process.env.JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
  const maxAge = 2 * 60 * 60 * 1000;
  res.cookie("jwt", token, {
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "None",
  });
  return token;
};
export const hashPassword = async (password) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
