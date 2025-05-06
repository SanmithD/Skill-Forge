import express from 'express';
import { auth } from 'express-openid-connect';
import { loginSchema, signupSchema } from '../config/auth.config.js';
import config from '../config/google.config.js';
import { login, oauthLogin, profile, signup } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.use(auth(config))
authRouter.post('/signup', signupSchema, signup );
authRouter.post('/login', loginSchema, login );
authRouter.get('/profile', profile);
authRouter.get('/oauth', async(req, res)=>{
    if (!req.oidc.isAuthenticated()) {
        return res.redirect('/login');
      }
}, oauthLogin )

export default authRouter