import dotenv from "dotenv";
dotenv.config();
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
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    maxAge,
    httpOnly: true,
    secure: isProd, // Production (HTTPS) bo‘lsa true
    sameSite: isProd ? "None" : "Lax", // Productionda "None", localda "Lax"
  });
};
