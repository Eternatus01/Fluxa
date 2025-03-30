import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import * as controller from "./controller.js";

const router = express.Router();

router.post('/subscribe', authenticate, controller.subscribe);
router.delete('/unsubscribe', authenticate, controller.unSubscribe);
router.get('/check', authenticate, controller.checkSubscription);
router.get('/get', authenticate, controller.getSubscriptions);

export default router;
