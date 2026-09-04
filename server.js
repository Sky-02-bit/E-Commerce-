import express from 'express';
import dotenv, { config } from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRotes from './routes/authRout.js';
import categoryRouts from './routes/categoryRouts.js'
import productRouts from './routes/productRouts.js'
import cors from 'cors';

// Rest object
const app = express();

// configer env
dotenv.config();

// database config
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.json()); // Required to read JSON body
// routes
app.use('/api/v1/auth', authRotes);
app.use('/api/v1/category', categoryRouts);
app.use('/api/v1/product', productRouts);

// Rest api
app.get('/', (req, res) => {
    res.send(
        "<h1> welcome to E-commerce app</h1>"
    );
});

// port
const PORT = process.env.PORT || 8080;

// Run listen
app.listen(PORT, () => {
    console.log(`server is running on ${process.env.DEV_MODE} on port ${PORT}...`);
});
