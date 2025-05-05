import express from 'express';
import { loginSchema, signupSchema } from '../config/auth.config.js';
import { login, profile, signup } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/signup', signupSchema, signup );
authRouter.post('/login', loginSchema, login );
authRouter.get('/profile', profile)

export default authRouter