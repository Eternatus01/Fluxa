import { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
    {
        path: "/login",
        name: "Login",
        component: () => import("../../../features/auth/pages/login.vue"),
    },
    {
        path: "/register",
        name: "Register",
        component: () => import("../../../features/auth/pages/register.vue"),
    },
];

export default authRoutes; 