import { Router } from "vue-router";
import { useAuthStore } from "../../../features/auth/stores/auth";

export function setupAuthGuard(router: Router) {
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
} 