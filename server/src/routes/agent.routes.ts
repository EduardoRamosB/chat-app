import { Router } from 'express'
import validateSchema from '../middlewares/validator.middleware'
import { createAgentSchema } from '../schemas/agent.schema'
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  createAvatar,
} from '../controllers/agents.controller'

const router = Router()

router.post('/agents', validateSchema(createAgentSchema), create)
router.get('/agents', getAll)
router.get('/agents/:id', getOne)
router.patch('/agents/:id', update)
router.delete('/agents/:id', remove)

router.post('/agents/avatar', createAvatar)

export default router
