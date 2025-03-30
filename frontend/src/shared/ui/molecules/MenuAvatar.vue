<template>
    <div class="relative">
        <img :src="channelAvatar" class="w-10 h-10 object-cover rounded-full ml-4 cursor-pointer bg-cover" alt="Аватар"
            @click="toggleMenu" />
        <Menu :is-menu-open="isMenuOpen"></Menu>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import Menu from './Menu.vue'
import { useUserStore } from './../../../features/user/stores/userStore';

const isMenuOpen = ref(false)

const userStore = useUserStore();
const channelAvatar = computed(() => userStore.avatar_url);
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value

    document.addEventListener('click', handleOutsideClick, true)
}

const handleOutsideClick = (event: MouseEvent) => {
    const avatar = (event.target as HTMLElement).closest('.cursor-pointer')
    if (!avatar && isMenuOpen.value) {
        isMenuOpen.value = false
        document.removeEventListener('click', handleOutsideClick, true)
    }
}

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick, true)
})
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
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