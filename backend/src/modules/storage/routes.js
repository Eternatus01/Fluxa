import express from "express";
import { body, validationResult } from "express-validator";
import * as controllerAvatar from "./avatar/controller.js";
import * as controllerBunner from "./bunner/controller.js";
import * as controllerVideo from "./video/controller.js";
import { ValidationError } from "../../middlewares/ValidationError.js";
import multer from "multer";
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

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/avatar",
  authenticate,
  upload.single("file"),
  body("filePath").notEmpty().withMessage("filePath is required"),
  validate,
  controllerAvatar.updateAvatar
);

router.patch(
  "/bunner",
  authenticate,
  upload.single("file"),
  body("filePath").notEmpty().withMessage("filePath is required"),
  validate,
  controllerBunner.updateBunner
);

router.post(
  "/video",
  authenticate,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  body("videoPath").notEmpty(),
  body("thumbnailPath").notEmpty(),
  validate,
  controllerVideo.uploadVideo
);

router.post(
  "/thumbnail",
  authenticate,
  upload.single("thumbnail"),
  body("thumbnailPath").notEmpty(),
  validate,
  controllerVideo.updateTumbnail
);

export default router;
