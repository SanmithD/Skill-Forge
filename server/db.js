import 'dotenv/config';
import mongoose from "mongoose";

const connect = async() =>{
    const URL = process.env.MONGO_URI
    try {
        const connectDB = await mongoose.connect(URL).then(()=>{
            console.log('connected')
        }).catch((error)=>{
            console.log(error)
        })
    } catch (error) {
        console.log(error)
    }
}

export default connect