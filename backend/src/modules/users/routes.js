import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import * as controller from "./controller.js";

const router = express.Router();

router.get("/me", authenticate, controller.getUser);
router.get("/get/id/:id", controller.getUserById);
router.get("/get/ids", controller.getUsersById);
router.get("/get/username/:username", controller.getUserByUsername);

export default router;
