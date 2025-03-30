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
  "/video",
  authenticate,
  body("video_id").notEmpty(),
  body("user_id").notEmpty(),
  body("type").notEmpty(),
  validate,
  controller.addReaction
);

router.get(
  "/video",
  query("video_id").notEmpty(),
  validate,
  controller.getReactions
);

router.post(
  "/comment",
  authenticate,
  body("comment_id").notEmpty(),
  body("user_id").notEmpty(),
  body("type").notEmpty(),
  validate,
  controller.addReactionComment
);

router.get(
  "/comment",
  query("comment_id").notEmpty(),
  validate,
  controller.getReactionsComment
);

export default router;
