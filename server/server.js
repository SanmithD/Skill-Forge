import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connect from './db.js';
import authRouter from './routes/auth.routes.js';

connect()
const app = express();
const PORT = process.env.PORT || 5001

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req, res)=>{
    res.send('Hello world')
});

app.use('/api/auth', authRouter );

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT} `)
});