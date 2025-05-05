import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    authType: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    }
},{
    timestamps: true
});

const authModel = mongoose.model('auth', authSchema);

export default authModel