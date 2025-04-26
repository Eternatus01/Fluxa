import { RouteRecordRaw } from 'vue-router';

const homeRoutes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("../../../features/home/pages/home.vue"),
        children: [
            {
                path: "",
                name: "HomeVideos",
                component: () => import("../../../features/home/pages/recommendations.vue"),
            },
            {
                path: "/feed/subscriptions",
                name: "SubscriptionsVideos",
                component: () => import("../../../features/home/pages/subscriptions.vue"),
            },
            {
                path: "/feed/playlists",
                name: "PlaylistsVideos",
                component: () => import("../../../features/home/pages/all-playlists.vue"),
            },
            {
                path: "/search",
                name: "SearchResults",
                component: () => import("../../../features/home/pages/search.vue"),
            },
        ]
    },
];

export default homeRoutes; 