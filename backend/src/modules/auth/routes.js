import express from "express";
import { body, validationResult } from "express-validator";
import * as controller from "./controller.js";
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
  "/signup",
  body("email").isEmail().withMessage("Неверный формат адреса почты"),
  body("password").notEmpty().trim().withMessage("Пароль обязательный"),
  validate,
  controller.signUp
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("Неверный формат адреса почты"),
  body("password").notEmpty().trim().withMessage("Пароль обязательный"),
  validate,
  controller.signIn
);

router.post("/signout", controller.signOut);

router.post(
  "/refresh",
  body("refresh_token").notEmpty().withMessage("Токен обновления обязателен"),
  validate,
  controller.refreshToken
);

export default router;
