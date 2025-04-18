import { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
    },
    work_date: {
      type: Date,
      default: new Date(),
    },
    work_end: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = model("User", authSchema);
export default User;
