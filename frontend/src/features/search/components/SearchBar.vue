<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
    }
};
</script>

<template>
    <div class="relative group">
        <div class="relative">
            <input type="text" v-model="searchQuery" @keyup.enter="handleSearch" placeholder="Поиск видео..." class="w-64 px-4 py-2 pl-10 bg-dark-200 text-white/90 rounded-xl
                    border border-dark-400 focus:border-primary-500/50
                    placeholder-white/40 outline-none
                    transition-all duration-300
                    group-focus-within:w-80 group-focus-within:bg-dark-300" />

            <!-- Search Icon -->
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-500/70">
                <i class="i-carbon-search text-xl"></i>
            </div>

            <!-- Clear Button -->
            <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 
                    hover:text-white/60 transition-colors">
                <i class="i-carbon-close text-xl"></i>
            </button>
        </div>

        <!-- Search Button (Mobile) -->
        <button @click="handleSearch" class="md:hidden absolute right-0 top-0 h-full px-4 
                bg-primary-500 text-white rounded-r-xl
                hover:bg-primary-600 transition-colors">
            <i class="i-carbon-search text-xl"></i>
        </button>
    </div>
</template>

<style scoped>
input::placeholder {
    color: rgba(255, 255, 255, 0.4);
}

input:focus::placeholder {
    color: rgba(255, 255, 255, 0.3);
}
</style>