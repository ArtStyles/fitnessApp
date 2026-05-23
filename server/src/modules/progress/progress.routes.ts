import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticate } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import { asyncHandler } from '../../shared/asyncHandler'
import { createEntrySchema, updateEntrySchema } from './progress.schema'
import { env } from '../../config/env'
import * as ctrl from './progress.controller'

// Ensure upload directory exists
const uploadDir = path.resolve(env.UPLOAD_DIR, 'progress')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

const router = Router()

router.get('/stats', authenticate, asyncHandler(ctrl.getProgressStats))
router.get('/photos', authenticate, asyncHandler(ctrl.getPhotos))
router.post('/photos', authenticate, upload.single('photo'), asyncHandler(ctrl.uploadPhoto))

router.get('/', authenticate, asyncHandler(ctrl.getUserProgress))
router.post('/', authenticate, validate(createEntrySchema), asyncHandler(ctrl.createEntry))
router.patch('/:id', authenticate, validate(updateEntrySchema), asyncHandler(ctrl.updateEntry))
router.delete('/:id', authenticate, asyncHandler(ctrl.deleteEntry))

export default router
