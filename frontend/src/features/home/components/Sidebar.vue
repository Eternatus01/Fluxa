<script setup lang="ts">
import { ref } from 'vue';

interface MenuItem {
    title: string;
    to: string;
    icon: string;
}

const menuItems = ref<MenuItem[]>([
    { title: 'Главная', to: '/', icon: 'i-carbon-home' },
    { title: 'Подписки', to: '/feed/subscriptions', icon: 'i-carbon-favorite' },
    { title: 'Плейлисты', to: '/feed/playlists', icon: 'i-carbon-music' }
]);
</script>

<template>
    <aside class="sidebar">
        <ul class="sidebar-menu">
            <li v-for="item in menuItems" :key="item.to">
                <router-link :to="item.to" class="sidebar-link" :class="{ active: $route.path === item.to }">
                    <i :class="[item.icon, 'sidebar-icon']"></i>
                    <span class="sidebar-title">{{ item.title }}</span>
                    <div v-if="$route.path === item.to" class="sidebar-active-bar"></div>
                </router-link>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
.sidebar {
    position: sticky;
    top: 5rem;
    height: calc(100vh - 2rem);
    width: 13rem;
    background: transparent;
    backdrop-filter: none;
    border-radius: 0.5rem;
    box-shadow: 0 8px 32px 0 rgba(30, 41, 59, 0.10);
    transition: background 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.sidebar-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.2rem;
    border-radius: 0.5rem;
    color: #a1a1aa;
    font-size: 1.08rem;
    font-weight: 500;
    position: relative;
    background: transparent;
    transition: background 0.18s, color 0.18s;
    overflow: hidden;
}

.sidebar-link:hover {
    background: rgba(255, 255, 255, 0.10);
    color: #fff;
}

.sidebar-link.active {
    background: rgba(30, 30, 30, 0.60);
    color: #fff;
}

.sidebar-icon {
    font-size: 1.45rem;
    transition: color 0.18s;
}

.sidebar-title {
    flex: 1;
    white-space: nowrap;
}

.sidebar-active-bar {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 70%;
    background: linear-gradient(180deg, #fff 0%, #e5e7eb 100%);
    border-radius: 0 6px 6px 0;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(-10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>