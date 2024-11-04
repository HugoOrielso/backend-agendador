import { Router } from 'express'
import { calendarsGoogle, listEvents } from '../controllers/google.js'

const router = Router()

router.get("/calendars", calendarsGoogle )
router.get("/listevents", listEvents )

export default router