import express from 'express';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import { uploadFile } from '../middleware/files.js';

// Set multer disk storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Multer settings
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only pdfs are allowed'));
    }
    cb(null, true);
  },
});

// Todo - input sanitisation

// Upload a file
router.post('/', upload.single('file'), uploadFile, async (req, res) => {});

// Get list of hymns that match search query
router.get('/', async (req, res) => {});

export default router;
