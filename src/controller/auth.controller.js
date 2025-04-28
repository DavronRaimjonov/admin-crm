import cloudinary from "../config/cloudinary.js";
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
    if (!findUser) {
      throw new CustomError(400, "Email or password wrong");
    }
    if (findUser.is_deleted) {
      throw new CustomError(400, "Sizga ruxsat yo'q");
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

export const edit_profile = async (req, res, next) => {
  try {
    const body = req.body;
    const _id = req.user._id;
    await User.findByIdAndUpdate(_id, {
      $set: {
        ...body,
      },
    });
    res.status(200).json({ status: 200, message: "sucsses" });
  } catch (error) {
    next(error);
  }
};

export const edit_profile_img = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError(400, "Image must be provided");
    }
    const fileBase64 = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "uploads",
    });
    await User.findByIdAndUpdate(req.user._id, {
      $set: { image: result.secure_url },
    });

    const resData = new ResData(200, "success", { image: result.secure_url });

    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
