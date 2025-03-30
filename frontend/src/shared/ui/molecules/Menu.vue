<template>
    <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-[#1e1e1e] rounded-lg shadow-lg z-10 animate-fadeIn">
        <ul class="py-2">
            <li v-for="(link, index) of menuLinks" :key="index">
                <router-link :to="getRoute(link)"
                    class="block px-4 py-2 text-white hover:bg-gray-700 hover:text-blue-500">
                    {{ link.text }}
                </router-link>
            </li>
            <li>
                <sign-out-button-component></sign-out-button-component>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import SignOutButtonComponent from '../atoms/SignOutButtonComponent.vue';
import { useUserStore } from './../../../features/user/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const username = computed(() => userStore.user?.username || '');

const menuLinks = [
    { name: 'Channel', text: 'Мой канал', params: computed(() => ({ username: username.value })) },
    { name: 'Settings', text: 'Настройки', params: '' },
];

const getRoute = (link: { name: string; params: any }) => {
    return {
        name: link.name,
        params: link.params.value || {},
    };
};

defineProps<{ isMenuOpen: boolean }>();
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>