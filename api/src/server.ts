import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import checkJwt from './authz/checkJwt';
import { clientOrigins, serverPort } from './config/env.dev';
import books from './routes/books';
import fileTypes from './routes/fileTypes';
import hymnFiles from './routes/hymnFiles';
import hymns from './routes/hymns';
import hymnTypes from './routes/hymnTypes';
import masses from './routes/masses';

// Init express
const app: Application = express();

app.use(helmet());

// Cors
app.use(cors({ origin: clientOrigins }));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Check if use is authenticated
app.use(checkJwt);

// API Routes
app.use('/api/books', books);
app.use('/api/fileTypes', fileTypes);
app.use('/api/hymnTypes', hymnTypes);
app.use('/api/hymns', hymns);
app.use('/api/hymns/:hymnId/files', hymnFiles);
app.use('/api/masses', masses);

app.listen(serverPort, () =>
  console.log(`Server started on port ${serverPort}`)
);
