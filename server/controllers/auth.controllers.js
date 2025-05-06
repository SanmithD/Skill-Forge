import bcrypt from 'bcrypt';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import authModel from "../models/auth.models.js";

const SECRET = process.env.JWT_SECRET;

const signup = async(req, res) =>{
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            success: false,
            message: 'Fill all the details'
        });
    };
    try {
        const user = await authModel.findOne({ email });
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        };
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new authModel({
            name,
            email,
            password: hashPassword,
            authType: "local"
        });
        await newUser.save();

        res.status(200).json({
            success: true,
            message: "New user created"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    };
};

const login = async(req, res) =>{
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "Fill all the fileds"
        });
    }
    try {
        const user = await authModel.findOne({ email });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exists"
            });
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(400).json({
                success: false,
                message: "Wrong credentials"
            });
        }

        const token = jwt.sign(
            {id: user._id, email: user.email},
            SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: "Login success",
            token,
            name: user.name
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
}

const profile = async(req, res) =>{
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(400).json({
            success: false,
            message: "Invalid token"
        });
    }
    try {
        const { id } = jwt.verify(token, SECRET);
        if(!id){
            return res.status(400).json({
                success: false,
                message: "Invalid id"
            });
        }
        const user = await authModel.findById(id);
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(201).json({
            success: true,
            message: "User profile",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error)
    }
}

const oauthLogin = async (req, res) => {
  const { email, name, sub } = req.oidc.user;

  // Check if user exists, otherwise create one
  let user = await authModel.findOne({ email });

  if (!user) {
    user = await authModel.create({
      name,
      email,
      password: '', // No local password
      authType: 'google',
      oauthId: sub
    });
  }

  // Issue custom JWT
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Send token to frontend
  res.status(200).json({
    success: true,
    message: 'OAuth login success',
    token,
    name: user.name
  });
};

export { login, oauthLogin, profile, signup };

