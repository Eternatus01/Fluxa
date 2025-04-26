import { RouteRecordRaw } from 'vue-router';

const playlistRoutes: RouteRecordRaw[] = [
    {
        path: "/playlists",
        name: "Playlists",
        component: () => import("../../../features/playlist/pages/playlists.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/playlist/:id",
        name: "Playlist",
        component: () => import("../../../features/playlist/pages/playlist.vue"),
        props: true,
    },
    {
        path: "/create-playlist",
        name: "CreatePlaylist",
        component: () => import("../../../features/playlist/pages/create-playlist.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: '/playlist/:id/edit',
        name: 'EditPlaylist',
        component: () => import('../../../features/playlist/pages/edit-playlist.vue'),
        meta: { requiresAuth: true }
    }
];

export default playlistRoutes; 