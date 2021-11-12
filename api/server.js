import express from 'express';
import cors from 'cors';
import upload from './routes/upload.js';
import { dbConnect } from './middleware/db.js';

// Init express
const app = express();
dbConnect();

// Cors
app.use(cors());

// Body parser middleware
app.use(express.json());
//app.use(express.urlencoded({ extended: false}));

// API Routes
app.use('/api/upload', upload);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
