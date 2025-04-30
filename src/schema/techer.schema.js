import { Schema, model } from "mongoose";

const teacherSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, default: null },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    work_date: { type: Date, default: new Date() },
    work_end: { type: Date, default: null },
    field: { type: String, required: true },
    status: {
      type: String,
      enum: ["faol", "ishdan bo'shatilgan"],
      default: "faol",
    },
    salary: { type: Number, default: 0 },
    is_deleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true, // Har doim vaqt bo‘lsin
  }
);

export default model("Teacher", teacherSchema);
