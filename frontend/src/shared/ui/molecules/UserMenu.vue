<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '../../../features/auth/stores/auth';
import { useUserStore } from '../../../features/user/stores/userStore';

const authStore = useAuthStore();
const userStore = useUserStore();
const isOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

const user = computed(() => userStore.user);

const toggleMenu = () => {
    isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div class="relative" ref="menuRef">
        <!-- User Avatar Button -->
        <button @click="toggleMenu" class="flex items-center gap-2 p-1 rounded-full
                hover:ring-2 hover:ring-primary-500/30
                focus:outline-none focus:ring-2 focus:ring-primary-500/50
                transition-all duration-300">
            <img :src="user?.avatar_url || ''" :alt="user?.username ?? ''" class="w-8 h-8 rounded-full object-cover" />
            <span class="text-white/90 text-sm hidden md:block">
                {{ user?.username || '' }}
            </span>
            <i class="i-carbon-chevron-down text-white/60" :class="{ 'rotate-180': isOpen }"></i>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-dark-200 rounded-xl shadow-lg
                ring-1 ring-white/10 backdrop-blur-sm
                transform origin-top-right transition-all duration-200">
            <div class="py-2">
                <!-- User Info -->
                <div class="px-4 py-3 border-b border-dark-400">
                    <p class="text-sm text-white/90">{{ user?.email || '' }}</p>
                    <p class="text-xs text-white/60 mt-1">{{ user?.channel_name || '' }}</p>
                </div>

                <!-- Menu Items -->
                <router-link to="/profile" class="block px-4 py-2 text-sm text-white/80 hover:bg-dark-300 hover:text-white
                        transition-colors duration-200">
                    <i class="i-carbon-user mr-2"></i>
                    Профиль
                </router-link>

                <router-link to="/settings" class="block px-4 py-2 text-sm text-white/80 hover:bg-dark-300 hover:text-white
                        transition-colors duration-200">
                    <i class="i-carbon-settings mr-2"></i>
                    Настройки
                </router-link>

                <!-- Divider -->
                <div class="border-t border-dark-400 my-1"></div>

                <!-- Logout Button -->
                <button @click="authStore.signOut" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-300
                        transition-colors duration-200">
                    <i class="i-carbon-logout mr-2"></i>
                    Выйти
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}
</style>