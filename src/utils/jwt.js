import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const genereteJwt = (params) => {
  const token = jwt.sign(params, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};
export const hashPassword = async (password) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
export const sendTokenAsCookie = (res, token) => {
  const maxAge = 1 * 60 * 60 * 1000;
  const isInDevelopment = process.env.NODE_ENV === "development";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isInDevelopment ? false : "none",
    secure: isInDevelopment ? false : true,
    maxAge,
  });
};
