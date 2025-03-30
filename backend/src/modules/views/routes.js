import express from "express";
import * as controller from "./controller.js";
import { body, validationResult } from "express-validator";
import { ValidationError } from "../../middlewares/ValidationError.js";

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
  "/add",
  body("video_id").notEmpty(),
  body("user_id").notEmpty(),
  validate,
  controller.addView
);

export default router;
