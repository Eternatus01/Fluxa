import { RouteRecordRaw } from 'vue-router';

const channelRoutes: RouteRecordRaw[] = [
    {
        path: "/@:username",
        name: "Channel",
        component: () => import("../../../features/channel/page/channel.vue"),
        props: true,
        redirect: to => {
            return { name: 'Channel_Videos', params: { username: to.params.username } };
        },
        children: [
            {
                path: "",
                name: "Channel_Videos",
                component: () => import("../../../features/channel/page/channel_videos.vue"),
                props: true,
            },
            {
                path: "playlists",
                name: "Channel_Playlists",
                component: () => import("../../../features/channel/page/channel_playlists.vue"),
                props: true,
            },
        ]
    },
    {
        path: "/settings",
        name: "Settings",
        component: () => import("../../../features/channel/page/channel_settings.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/subscriptions",
        name: "Subscriptions",
        component: () => import("../../../features/subscription/pages/subscriptions.vue"),
        meta: { requiresAuth: true },
    },
];

export default channelRoutes; 