import { Schema, model } from "mongoose";

const CourseSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },
    name: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", CourseSchema);
export default Course;
