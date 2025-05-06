import express from 'express';
import upload from '../config/cloud.config.js';
import { deleteCourse, giveLike, postComment, postCourse, removeLike } from '../controllers/course.controllers.js';

const courseRouter = express.Router();

courseRouter.post('/course', upload.single('video'), postCourse );
courseRouter.post('/comment/:courseId', postComment );
courseRouter.patch('/course/:courseId/like', giveLike );
courseRouter.patch('/course/:courseId/unlike', removeLike );
courseRouter.delete('/course/:courseId', deleteCourse )

export default courseRouter