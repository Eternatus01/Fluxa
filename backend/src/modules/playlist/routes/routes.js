import express from "express";
import { authenticate } from "../../../middlewares/auth.js";
import * as controller from "../controller/controller.js";
import { body, validationResult, param } from "express-validator";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Создание нового плейлиста
router.post(
  "/create",
  authenticate,
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  body("title").notEmpty().withMessage("Название плейлиста обязательно"),
  body("description")
    .isLength({ max: 1000 })
    .withMessage("Описание не должно превышать 1000 символов"),
  validate,
  controller.createPlaylist
);

// Получение публичных плейлистов
router.get("/public", controller.getPublicPlaylists);

// Получение плейлиста по ID
router.get(
  "/:id",
  param("id").notEmpty().withMessage("ID плейлиста обязателен"),
  validate,
  controller.getPlaylist
);

// Получение плейлистов пользователя
router.get(
  "/user/:user_id",
  param("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  validate,
  controller.getUserPlaylists
);

// Добавление видео в плейлист
router.post(
  "/add-video",
  authenticate,
  body("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  body("video_id").notEmpty().withMessage("ID видео обязателен"),
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  validate,
  controller.addVideoToPlaylist
);

// Удаление видео из плейлиста
router.post(
  "/remove-video",
  authenticate,
  body("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  body("video_id").notEmpty().withMessage("ID видео обязателен"),
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  validate,
  controller.removeVideoFromPlaylist
);

// Удаление плейлиста
router.delete(
  "/delete",
  authenticate,
  body("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  validate,
  controller.deletePlaylist
);

// Обновление плейлиста
router.patch(
  "/update",
  authenticate,
  body("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  body("title").notEmpty().withMessage("Название обязательно"),
  body("description").notEmpty().withMessage("Описание обязательно"),
  body("is_public").isBoolean().withMessage("is_public должен быть булевым"),
  body("thumbnail_url").exists(),
  validate,
  controller.updatePlaylist
);

// Подписка на плейлист
router.post(
  "/subscribe",
  authenticate,
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  body("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  validate,
  controller.subscribeToPlaylist
);

// Отписка от плейлиста
router.post(
  "/unsubscribe",
  authenticate,
  body("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  body("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  validate,
  controller.unsubscribeFromPlaylist
);

// Получить плейлисты, на которые подписан пользователь
router.get(
  "/subscribed/:user_id",
  param("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  validate,
  controller.getSubscribedPlaylists
);

// Проверить, подписан ли пользователь на плейлист
router.get(
  "/isSubscribed/:user_id/:playlist_id",
  param("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  param("playlist_id").notEmpty().withMessage("ID плейлиста обязателен"),
  validate,
  controller.isSubscribedToPlaylist
);

// Получить все плейлисты пользователя: собственные и по подписке
router.get(
  "/all/:user_id",
  param("user_id").notEmpty().withMessage("ID пользователя обязателен"),
  validate,
  controller.getAllUserPlaylists
);

export default router;
