<template>
    <nav class="flex items-center w-full justify-end">
        <ul class="flex gap-4 text-white text-xl">
            <li v-if="isAuthenticated" class="flex gap-4">
                <router-link :to="nav.to" class="hover:underline" v-for="nav of navLinksAuth" :key="nav.id">
                    {{ nav.text }}
                </router-link>
                <menu-avatar></menu-avatar>
            </li>
            <li v-else-if="isCheckingAuth" class="flex gap-4">
                <span class="text-gray-400">Проверка авторизации...</span>
            </li>
            <li v-else class="flex gap-4">
                <router-link to="/login" class="hover:underline">Авторизация</router-link>
                <router-link to="/register" class="hover:underline">Регистрация</router-link>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { useUserStore } from './../../../features/user/stores/userStore';
import { useAuthStore } from '../../../features/auth/stores/auth';
import { computed, onMounted } from 'vue';
import MenuAvatar from './MenuAvatar.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

// Проверяем авторизацию при монтировании компонента
onMounted(() => {
    authStore.checkAuth();
});

// Вычисляемые свойства для проверки состояния авторизации
const isAuthenticated = computed(() => !!userStore.user);
const isCheckingAuth = computed(() => authStore.isCheckingAuth);

const navLinksAuth = [
    { to: '/subscriptions', text: 'Подписки' },
    { to: '/playlist', text: 'Плейлисты' },
    { to: '/history', text: 'История' },
    { to: '/upload', text: '+' },
]
</script>