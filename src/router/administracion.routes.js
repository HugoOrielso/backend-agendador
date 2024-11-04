import { Router } from "express";
import { allDaysData, changeState, crearAdmin, createNewDay, getDayByDate, iniciarSesion } from "../controllers/administracion.js";
import { auth } from "../middlewares/auth.js";
import { refreshTokenController } from "../middlewares/tokenController.js";

const router = Router()



router.post('/', crearAdmin)
router.get('/generate-token', refreshTokenController)
router.post('/login', iniciarSesion)
router.post('/day', auth, createNewDay)
router.get('/day', auth, allDaysData)
router.post('/state', auth, changeState)
router.get('/day/:date', auth, getDayByDate)


export default router