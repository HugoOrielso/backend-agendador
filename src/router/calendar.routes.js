import { Router } from "express";
import { enableDays , createNewEvent} from "../controllers/dataCalendar.js";

const router = Router()

router.get("/days", enableDays)
router.post("/date", createNewEvent)

export default router