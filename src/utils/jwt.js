import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const genereteJwt = (params) => {
  const token = jwt.sign(params, process.env.JWT_SECRET_KEY, {
    expiresIn: "2h",
  });
  const maxAge = 2 * 60 * 60 * 1000;
  return token;
};
export const hashPassword = async (password) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
