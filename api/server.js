import express from 'express';
import cors from 'cors';
import hymns from './routes/hymns.js';
import files from './routes/files.js';

// Init express
const app = express();

// Cors
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/hymns', hymns);
app.use('/api/files', files);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
