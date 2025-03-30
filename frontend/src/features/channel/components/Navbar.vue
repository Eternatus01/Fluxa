<template>
    <nav class="channel-navbar">
        <ul class="tabs-container">
            <li v-for="(tab, index) in tabs" :key="tab.name" class="tab-item"
                :class="{ 'active': isActive(tab.routeName) }" :style="{ 'animation-delay': `${0.1 + index * 0.1}s` }">
                <router-link :to="{ name: tab.routeName, params: { username: username } }" class="tab-link">
                    {{ tab.name }}
                </router-link>
                <span v-if="isActive(tab.routeName)" class="active-indicator"></span>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const username = computed(() => route.params.username as string)

const isActive = (routeName: string) => {
    return route.name === routeName
}

const tabs = [
    { name: 'Видео', routeName: 'Home' },
    { name: 'Плейлисты', routeName: 'Home' },
    { name: 'Трансляции', routeName: 'Home' },
    { name: 'Посты', routeName: 'Home' },
]
</script>

<style scoped>
.channel-navbar {
    margin: 1rem 0 2rem;
    padding: 0 1rem;
}

.tabs-container {
    display: flex;
    gap: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.25rem;
}

.tab-item {
    position: relative;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    animation: tabAppear 0.5s ease-out forwards;
}

.tab-link {
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    transition: color 0.3s ease;
}

.tab-item:hover .tab-link {
    color: rgba(255, 255, 255, 0.9);
}

.tab-item.active .tab-link {
    color: #3b82f6;
}

.active-indicator {
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: #3b82f6;
    border-radius: 2px;
    transform-origin: left;
    animation: indicatorAppear 0.3s ease-out;
}

@keyframes indicatorAppear {
    from {
        transform: scaleX(0);
    }

    to {
        transform: scaleX(1);
    }
}

@keyframes tabAppear {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>