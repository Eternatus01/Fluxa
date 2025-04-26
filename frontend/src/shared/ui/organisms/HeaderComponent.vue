<template>
    <header class="sticky top-0 z-50 bg-[#0F0F0F] text-white">
        <div class="flex items-center justify-between h-16 px-4 lg:px-6">
            <!-- Левая часть с лого -->
            <div class="flex items-center flex-shrink-0">
                <logo class="mr-4"></logo>
            </div>

            <!-- Центральная часть с поиском -->
            <div class="flex-1 max-w-2xl mx-4 hidden sm:block">
                <search></search>
            </div>

            <!-- Правая часть с навигацией -->
            <div class="flex items-center">
                <!-- Поиск для мобильных -->
                <div class="sm:hidden mr-2">
                    <button @click="toggleMobileSearch" class="p-2 hover:bg-dark-300 rounded-full">
                        <i class="i-carbon-search text-2xl"></i>
                    </button>
                </div>
                <navbar></navbar>
            </div>
        </div>

        <!-- Мобильный поиск (появляется при клике) -->
        <div v-if="showMobileSearch" class="sm:hidden px-4 pb-3 animate-fadeIn">
            <search></search>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Logo from '../atoms/Logo.vue';
import Search from '../atoms/Search.vue';
import Navbar from '../molecules/Navbar.vue';

const showMobileSearch = ref(false);

const toggleMobileSearch = () => {
    showMobileSearch.value = !showMobileSearch.value;
};
</script>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
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