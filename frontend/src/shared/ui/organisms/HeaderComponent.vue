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
                    <button class="p-2 hover:bg-dark-300 rounded-full">
                        <i class="i-carbon-search text-2xl"></i>
                    </button>
                </div>
                <navbar></navbar>
            </div>
        </div>

        <!-- Мобильный поиск (появляется при клике) -->
        <div class="sm:hidden px-4 pb-3">
            <search></search>
        </div>
    </header>
</template>

<script setup>
import Logo from '../atoms/Logo.vue';
import Search from '../atoms/Search.vue';
import Navbar from '../molecules/Navbar.vue';
</script>