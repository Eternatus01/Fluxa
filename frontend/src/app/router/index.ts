import { createRouter, createWebHistory } from "vue-router";
import { setupAuthGuard } from "./guards/auth.guard";

// Импорт маршрутов из отдельных файлов
import homeRoutes from "./routes/home.routes";
import authRoutes from "./routes/auth.routes";
import channelRoutes from "./routes/channel.routes";
import videoRoutes from "./routes/video.routes";
import playlistRoutes from "./routes/playlist.routes";
import errorRoutes from "./routes/error.routes";

// Объединение всех маршрутов
const routes = [
  ...homeRoutes,
  ...authRoutes,
  ...channelRoutes,
  ...videoRoutes,
  ...playlistRoutes,
  ...errorRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Добавляем scrollBehavior для контроля прокрутки между страницами
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Установка навигационного хука для проверки авторизации
setupAuthGuard(router);

export default router;
