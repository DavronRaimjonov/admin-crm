import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
export const genereteJwt = (params, res) => {
  const token = jwt.sign(params, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    maxAge: 1 * 60 * 60 * 1000, // 1h
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return token;
};
export const hashPassword = async (password) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
