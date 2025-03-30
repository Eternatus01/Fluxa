import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../../features/auth/stores/auth";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../../pages/home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../../features/auth/pages/login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../../features/auth/pages/register.vue"),
  },
  {
    path: "/upload",
    name: "Upload",
    component: () => import("../../features/video/pages/upload.vue"),
  },
  {
    path: "/subscriptions",
    name: "Subscriptions",
    component: () => import("../../features/subscription/pages/subscriptions.vue"),
  },
  {
    path: "/@:username",
    name: "Channel",
    component: () => import("../../features/channel/page/channel.vue"),
    props: true,
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../../features/channel/page/channel_settings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/history",
    name: "History",
    component: () => import("../../features/history/pages/history.vue"),
  },
  {
    path: "/watch/:id",
    name: "Watch",
    component: () => import("../../features/video/pages/watch.vue"),
    props: true,
  },
  {
    path: "/video/control/:id",
    name: "VideoControl",
    component: () => import("../../features/video/pages/videoControl.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Защита маршрутов, требующих авторизации
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Проверяем, требует ли маршрут авторизации
  if (to.meta.requiresAuth) {
    try {
      // Проверяем авторизацию пользователя
      await authStore.checkAuth();

      if (authStore.isAuthenticated) {
        // Пользователь авторизован, разрешаем переход
        next();
      } else {
        // Пользователь не авторизован, перенаправляем на страницу входа
        next({ name: 'Login', query: { redirect: to.fullPath } });
      }
    } catch (error) {
      // В случае ошибки перенаправляем на страницу входа
      next({ name: 'Login', query: { redirect: to.fullPath } });
    }
  } else {
    // Маршрут не требует авторизации, разрешаем переход
    next();
  }
});

export default router;
