import express from 'express';
import cors from 'cors';
import fileTypes from './routes/fileTypes.js';
import books from './routes/books.js';
import hymns from './routes/hymns.js';
import files from './routes/files.js';
import masses from './routes/masses.js';
import hymnTypes from './routes/hymnTypes.js';

// Init express
const app = express();

// Cors
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/books', books);
app.use('/api/fileTypes', fileTypes);
app.use('/api/files', files);
app.use('/api/hymnTypes', hymnTypes);
app.use('/api/hymns', hymns);
app.use('/api/masses', masses);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
