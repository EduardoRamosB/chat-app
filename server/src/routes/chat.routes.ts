import { Router } from 'express'
import {
  create,
  getAll,
  createMessage,
  getStream,
  getOne,
  getPresigned,
} from '../controllers/chats.controller'

const router = Router()

router.post('/chats', create)
router.get('/chats', getAll)
router.get('/chats/:id', getOne)
router.post('/chats/:id/messages', createMessage)

router.post('/chats/messages/stream', getStream)
router.get('/chats/presigned/:filename', getPresigned)

export default router
