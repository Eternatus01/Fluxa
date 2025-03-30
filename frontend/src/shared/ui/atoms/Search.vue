<template>
    <form @submit.prevent="handleSubmit" class="w-full">
        <div
            class="flex items-center h-10 w-full bg-dark-200 hover:bg-dark-300 focus-within:bg-dark-300 rounded-full overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-white/20 focus-within:ring-primary-500/50">
            <!-- Иконка поиска слева -->
            <div class="flex-shrink-0 pl-4">
                <i class="i-carbon-search text-white/60 text-xl"></i>
            </div>

            <!-- Поле ввода -->
            <input type="text" v-model="searchQuery"
                class="w-full h-full px-4 bg-transparent text-white placeholder-white/60 focus:outline-none text-base"
                placeholder="Поиск...">

            <!-- Кнопка поиска -->
            <button type="submit"
                class="flex items-center h-full px-4 text-white/90 hover:text-white transition-colors border-l border-white/10">
                <span class="hidden sm:block mr-2">Найти</span>
                <i class="i-carbon-arrow-right text-xl"></i>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';
import { useVideoStore } from '@/features/video/stores/videoStore';

const router = useRouter();
const videoStore = useVideoStore();
const searchQuery = ref('');

// Создаем debounced функцию для поиска
const debouncedSearch = debounce(async (query: string) => {
    try {
        if (query.trim()) {
            await videoStore.searchVideos(query);
            // Если мы не на главной странице, перенаправляем на неё
            if (router.currentRoute.value.name !== 'Home') {
                router.push({ name: 'Home', query: { search: query } });
            } else {
                // Обновляем query параметр без перезагрузки страницы
                router.replace({ query: { search: query } });
            }
        } else {
            // Если поиск пустой, загружаем все видео
            await videoStore.fetchVideos();
            // Убираем параметр search из URL
            if (router.currentRoute.value.query.search) {
                router.replace({ query: {} });
            }
        }
    } catch (error) {
        console.error('Ошибка при поиске:', error);
    }
}, 300);

// Следим за изменениями в поле поиска
watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery);
});

// Обработчик отправки формы
const handleSubmit = () => {
    debouncedSearch(searchQuery.value);
};
</script>