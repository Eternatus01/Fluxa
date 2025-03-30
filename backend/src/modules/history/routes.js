import express from "express";
import * as controller from "./controller.js";
import { body, validationResult, query } from "express-validator";
import { ValidationError } from "../../middlewares/ValidationError.js";
import { authenticate } from "../../middlewares/auth.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));
    return next(new ValidationError(validationErrors));
  }
  next();
};

router.post(
  "/",
  authenticate,
  body("video_id").notEmpty(),
  validate,
  controller.addToHistory
);

router.get(
  "/",
  query("user_id").notEmpty(),
  authenticate,
  controller.getHistory
);

router.delete(
  "/",
  authenticate,
  controller.clearHistory
);

export default router;
