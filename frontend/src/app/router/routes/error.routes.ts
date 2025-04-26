import { RouteRecordRaw } from 'vue-router';

// Предполагаем, что у вас есть или вы создадите компонент NotFound
const errorRoutes: RouteRecordRaw[] = [
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../../../features/error/pages/not-found.vue"),
    }
];

export default errorRoutes; 