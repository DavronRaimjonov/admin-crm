import { Schema, model } from "mongoose";

const authSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "manager", "raxbar"],
      default: "admin",
    },
    work_date: { type: Date, default: new Date() },
    work_end: { type: Date, default: null },
    active: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["faol", "ta'tilda", "ishdan bo'shatilgan"],
      default: "faol",
    },
    is_deleted: { type: Boolean, default: false },
    leave_history: {
      type: [
        {
          start_date: { type: Date },
          end_date: { type: Date },
          reason: { type: String },
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = model("User", authSchema);
export default User;
