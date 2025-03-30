<template>
    <ul class="flex gap-6 border-b border-gray-700">
        <li v-for="tab in tabs" :key="tab.name" class="relative py-2 px-4 cursor-pointer">
            <router-link :to="{ name: tab.routeName, params: { username: username } }"
                class="text-white hover:text-gray-300">
                {{ tab.name }}
            </router-link>
            <span v-if="isActive(tab.routeName)"
                class="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t"></span>
        </li>
    </ul>
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

<style scoped></style>