import { Router } from 'express'
import { me, updateMe } from './user.controllers'
import { protect } from '../../utils/auth'

const router = Router()

router.get('/', protect, me)
router.put('/', updateMe)






export default router
