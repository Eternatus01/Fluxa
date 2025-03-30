import express from "express";
import { body, validationResult } from "express-validator";
import * as controller from "./controller.js";
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

router.patch(
  "/avatar",
  authenticate,
  body("avatar_url").notEmpty().withMessage("filePath is required"),
  body("id").notEmpty().isUUID().withMessage("id is required"),
  validate,
  controller.changeAvatar
);

router.patch(
  "/bunner",
  authenticate,
  body("bunner_url").notEmpty().withMessage("filePath is required"),
  body("id").notEmpty().isUUID().withMessage("id is required"),
  validate,
  controller.changeBunner
);

router.patch(
  "/channel_name",
  authenticate,
  body("channel_name").notEmpty().withMessage("ChannelName is required"),
  body("id").notEmpty().isUUID().withMessage("id is required"),
  validate,
  controller.changeChannelName
);

export default router;
