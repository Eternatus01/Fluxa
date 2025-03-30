<script setup lang="ts">
import { ref } from 'vue';

interface MenuItem {
    title: string;
    to: string;
    icon: string;
}

const menuItems = ref<MenuItem[]>([
    { title: 'Главная', to: '/', icon: 'i-carbon-home' },
    { title: 'Трансляции', to: '/streams', icon: 'i-carbon-video' },
    { title: 'Подписки', to: '/subscriptions', icon: 'i-carbon-favorite' },
    { title: 'Сообщество', to: '/community', icon: 'i-carbon-group' }
]);
</script>

<template>
    <aside
        class="sticky top-16 h-[calc(100vh-4rem)] w-48 bg-surface-secondary rounded-xl py-6 px-2 transition-all duration-300 ease-in-out shadow-lg">
        <ul class="flex flex-col gap-2">
            <li v-for="item in menuItems" :key="item.to">
                <router-link :to="item.to"
                    class="flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
                    :class="[
                        $route.path === item.to
                            ? 'text-white bg-surface-tertiary'
                            : 'text-dark-500 hover:text-white hover:bg-surface-tertiary'
                    ]">
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all duration-500">
                    </div>
                    <i :class="[item.icon, 'text-xl']"></i>
                    <span class="font-medium">{{ item.title }}</span>
                    <div v-if="$route.path === item.to"
                        class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"></div>
                </router-link>
            </li>
        </ul>
    </aside>
</template>

<style scoped>
.router-link-active {
    position: relative;
    font-weight: 500;
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

.router-link-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 20px;
    background-color: rgb(99 102 241);
    border-radius: 0 4px 4px 0;
    animation: fadeIn 0.3s ease-out;
}
</style>