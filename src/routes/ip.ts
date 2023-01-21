import { Router } from 'express'
import { getIpValidator } from '../validators/ip'
import { getIpController, deleteIpController } from '../controllers/ip'
import { auth } from '../custom_middlewares/auth'

const router = Router()

router.get(
    '/:ip',
    auth,
    getIpValidator,
    getIpController
)

router.delete(
    '/:ip',
    auth,
    getIpValidator,
    deleteIpController
)

export default router