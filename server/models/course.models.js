import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "auth",
        },
        likedAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    comments: [
      {
        message: { type: String, required: true },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "auth",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ]
  },
  { timestamps: true }
);

const courseModel = mongoose.model("course", courseSchema);
export default courseModel;
