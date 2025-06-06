import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    payment_price: { type: Number, required: true },
    month: { type: String, required: true },
    paidAt: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ["naqd", "karta"],
      required: true,
      default: "naqd",
    },
  },
  { _id: false }
);

const groupSchema = new Schema(
  {
    _id: {
      type: String,
      default: "",
    },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    status: {
      type: String,
      enum: ["aktiv", "chiqdi", "bitirgan"],
      default: "aktiv",
    },
    joinedAt: { type: Date, default: Date.now },
    exitedAt: { type: Date, default: null },
    payments: [paymentSchema],
  },
  { _id: false }
);
const studentSchema = new Schema(
  {
    first_name: { type: String, required: [true, "Ism majburiy"] },
    last_name: { type: String, required: [true, "Familiya majburiy"] },
    phone: { type: String, default: null },
    adress: { type: String, default: null },
    groups: [groupSchema],
    all_price_group: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["faol", "ta'tilda", "yakunladi", "bitirgan"],
      default: "faol",
    },
    is_deleted: { type: Boolean, default: false },
    leave_history: {
      type: [
        {
          start_date: { type: Date },
          end_date: { type: Date },
          days: { type: Number },
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

const Student = model("Student", studentSchema);
export default Student;
