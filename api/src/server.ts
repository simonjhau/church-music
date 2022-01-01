import cors from 'cors';
import express, { Application } from 'express';
import books from './routes/books';
import fileTypes from './routes/fileTypes';
import hymnFiles from './routes/hymnFiles';
import hymns from './routes/hymns';
import hymnTypes from './routes/hymnTypes';
import masses from './routes/masses';

// Init express
const app: Application = express();

// Cors
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/books', books);
app.use('/api/fileTypes', fileTypes);
app.use('/api/hymnTypes', hymnTypes);
app.use('/api/hymns', hymns);
app.use('/api/hymns/:hymnId/files', hymnFiles);
app.use('/api/masses', masses);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
