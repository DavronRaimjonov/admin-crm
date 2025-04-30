import { Schema, model } from "mongoose";

const studentSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null },
    image: { type: String, default: null },
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    status: {
      type: String,
      enum: ["faol", "ta'tilda", "yakunladi"],
      default: "faol",
    },
    is_deleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export default model("Student", studentSchema);
