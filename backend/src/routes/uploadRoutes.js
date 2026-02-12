import { Router } from 'express';
import multer from 'multer';
import uploadController from '../controllers/uploadController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDFs allowed'), false);
  },
});

router.post(
  '/',
  requireAuth,
  upload.single('pdfFile'),
  uploadController.uploadPDF.bind(uploadController),
);

export default router;
