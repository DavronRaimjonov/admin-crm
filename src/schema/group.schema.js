import { Schema, model } from "mongoose";

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    is_deleted: { type: Boolean, default: false },
    started_group: { type: Date, required: true },
    end_group: { type: Date, default: null },
    disable: { type: Boolean, default: false },
    price: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Group = model("Group", groupSchema);
export default Group;
