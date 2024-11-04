
import { Router } from "express";
import { captureOrder , newOrder } from "../controllers/paypal.js";

const router = Router()

router.post("/orders", newOrder);
router.post("/orders/:orderID/capture", captureOrder); 

export default router