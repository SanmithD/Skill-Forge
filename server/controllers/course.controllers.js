import "dotenv/config";
import jwt from "jsonwebtoken";
import courseModel from "../models/course.models.js";

const SECRET = process.env.JWT_SECRET;

export const postCourse = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { title, description, category } = req.body;
  const video = req.file ? req.file.path : null;

  if (!title || !description || !category || !video) {
    return res.status(400).json({
      success: false,
      message: "Fill all details",
    });
  }

  try {
    const { id } = jwt.verify(token, SECRET);
    const course = new courseModel({
      userId: id,
      title,
      description,
      category,
      video,
    });

    await course.save();
    res.status(200).json({
      success: true,
      message: "Course posted",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.log(error);
  }
};

export const postComment = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { message } = req.body;
  const { courseId } = req.params;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Please provide courseId and message",
    });
  }

  try {
    const { id } = jwt.verify(token, SECRET);

    const commentObj = {
      message,
      userId: id,
    };

    const updatedCourse = await courseModel.findByIdAndUpdate(
      courseId,
      { $push: { "details.comments": commentObj } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment added",
      updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    console.log(error);
  }
};

// ✅ Like a course (if not already liked)
export const giveLike = async (req, res) => {
  const { courseId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { id: userId } = jwt.verify(token, SECRET);
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if user already liked
    const alreadyLiked = course.likes.some(
      (like) => like.userId.toString() === userId
    );
    if (alreadyLiked) {
      return res.status(400).json({ success: false, message: "Already liked" });
    }

    course.likes.push({ userId });
    await course.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Course liked",
        likes: course.likes.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Dislike (remove like)
export const removeLike = async (req, res) => {
  const { courseId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { id: userId } = jwt.verify(token, SECRET);
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Remove user's like
    course.likes = course.likes.filter(
      (like) => like.userId.toString() !== userId
    );
    await course.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Like removed",
        likes: course.likes.length,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete Course (only by course owner)
export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { id: userId } = jwt.verify(token, SECRET);
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (course.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Not your course" });
    }

    await courseModel.findByIdAndDelete(courseId);
    res.status(200).json({ success: true, message: "Course deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
