import express from "express";
import { authenticate } from "./../../../middlewares/auth.js";
import * as controller from "../controller/controller.js";
import * as tagController from "../controller/videoTagsController.js";
import * as commentsController from "../controller/commentsController.js";
import { body, validationResult, query } from "express-validator";
import { ValidationError } from "./../../../middlewares/ValidationError.js";

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
  "/upload",
  authenticate,
  body("user_id").notEmpty(),
  body("title").notEmpty(),
  body("description")
    .isLength({ max: 2000 })
    .withMessage("Максимум 2000 символов"),
  body("videoUrl").isURL().withMessage("videoUrl is required"),
  body("thumbnailUrl").isURL(),
  body("videoType").notEmpty(),
  validate,
  controller.uploadVideo
);

router.patch(
  "/update",
  authenticate,
  body("video_id").notEmpty(),
  body("user_id").notEmpty().isUUID(),
  body("title").notEmpty(),
  body("type").notEmpty(),
  body("description")
    .isLength({ max: 2000 })
    .withMessage("Максимум 2000 символов"),
  body("thumbnailUrl").notEmpty().isURL(),
  body("video_url").notEmpty().isURL(),
  validate,
  controller.updateVideo
);

router.get("/all", controller.getAllVideos);

router.get(
  "/userVideos",
  query("user_id").notEmpty(),
  validate,
  controller.getUserVideos
);

router.get(
  "/fetch",
  query("id").notEmpty(),
  query("user_id"),
  validate,
  controller.getVideo
);

// Получить все видео пользователей, на которых подписан
router.get("/subscriptions", controller.getSubscribedVideos);

// Теги

router.post(
  "/:videoId/tags",
  authenticate,
  body("tags").isArray().withMessage("Теги должны быть массивом"),
  tagController.addTagsToVideo
);

router.get("/:videoId/tags", tagController.getTagsForVideo);

router.delete(
  "/:videoId/tags/:tagId",
  authenticate,
  tagController.removeTagFromVideo
);

router.get("/:videoId/comments", commentsController.getComments);
router.get("/comments/:commentId/replies", commentsController.getReplies);

router.post(
  "/:videoId/comments",
  authenticate,
  body("videoId").notEmpty(),
  validate,
  commentsController.addComment
);

router.delete(
  "/comments/:commentId",
  authenticate,
  body("comment_id").notEmpty(),
  validate,
  commentsController.deleteComment
);

router.get(
  "/search",
  query("query").notEmpty().withMessage("Поисковый запрос обязателен"),
  validate,
  controller.searchVideos
);

export default router;
