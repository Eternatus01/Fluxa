import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middlewares/errorHandler.js";

import authRoutes from "./src/modules/auth/routes.js";
import userRoutes from "./src/modules/users/routes.js";
import changeRoutes from "./src/modules/changeDataUsers/routes.js";
import storageRoutes from "./src/modules/storage/routes.js";
import videoRoutes from "./src/modules/video/routes/routes.js";
import subscriptionRoutes from "./src/modules/subscription/routes.js";
import viewsRoutes from "./src/modules/views/routes.js";
import reactionsRoutes from "./src/modules/reactions/routes.js";
import historyRoutes from "./src/modules/history/routes.js";
import playlistRoutes from "./src/modules/playlist/routes/routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URLS?.split(",") || "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Подключение маршрутов
app.use("/api/auth", authRoutes);
app.use("/api/change", changeRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/views", viewsRoutes);
app.use("/api/reactions", reactionsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/playlist", playlistRoutes);

//Подключение обработчика ошибок
app.use(errorHandler);

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
