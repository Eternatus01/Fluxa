<template>
    <nav class="channel-navbar">
        <div class="tabs-container">
            <router-link :to="{ name: tab.routeName, params: { username: username } }" v-for="(tab, index) in tabs"
                :key="tab.name" class="tab-item" :class="{ 'active': isActive(tab.routeName) }"
                :style="{ 'animation-delay': `${0.1 + index * 0.1}s` }">
                <span class="tab-link">
                    {{ tab.name }}
                </span>
                <span v-if="isActive(tab.routeName)" class="active-indicator"></span>
            </router-link>
        </div>
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
    { name: 'Видео', routeName: 'Channel_Videos' },
    { name: 'Плейлисты', routeName: 'Channel_Playlists' },
]
</script>

<style scoped>
.channel-navbar {
    padding: 0 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
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