import { Router } from "express";
import { getUser, saveUser } from "../controllers/users.js";

const router = Router()

router.get('/:email', getUser)
router.post('/', saveUser)




export default router