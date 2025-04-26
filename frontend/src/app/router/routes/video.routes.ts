import { RouteRecordRaw } from 'vue-router';

const videoRoutes: RouteRecordRaw[] = [
    {
        path: "/watch/:id",
        name: "Watch",
        component: () => import("../../../features/video/pages/watch.vue"),
        props: true,
    },
    {
        path: "/video/control/:id",
        name: "VideoControl",
        component: () => import("../../../features/video/pages/videoControl.vue"),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: "/upload",
        name: "Upload",
        component: () => import("../../../features/upload/pages/upload.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/history",
        name: "History",
        component: () => import("../../../features/history/pages/history.vue"),
        meta: { requiresAuth: true },
    },
];

export default videoRoutes; 