<template>
    <form @submit.prevent="handleSubmit" class="w-full">
        <div
            class="flex items-center h-10 w-full bg-dark-200 hover:bg-dark-300 focus-within:bg-dark-300 rounded-full overflow-hidden transition-all duration-300 ring-1 ring-white/10 hover:ring-white/20 focus-within:ring-primary-500/50">
            <!-- Иконка поиска слева -->
            <div class="flex-shrink-0 pl-4">
                <i class="i-carbon-search text-white/60 text-xl"></i>
            </div>

            <!-- Поле ввода -->
            <input type="text" v-model="searchQuery" @input="handleInput"
                class="w-full h-full px-4 bg-transparent text-white placeholder-white/60 focus:outline-none text-base"
                placeholder="Поиск..." maxlength="100">

            <!-- Кнопка поиска с индикатором загрузки -->
            <button type="submit"
                class="flex items-center h-full px-4 text-white/90 hover:text-white transition-colors border-l border-white/10"
                :disabled="!isValidQuery || isSearching">
                <span class="hidden sm:block mr-2">{{ isSearching ? 'Поиск...' : 'Найти' }}</span>
                <i v-if="!isSearching" class="i-carbon-arrow-right text-xl"></i>
                <span v-else
                    class="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useVideoStore } from '@/features/video/stores/videoStore';
import { useRouter } from 'vue-router';

const videoStore = useVideoStore();
const router = useRouter();
const searchQuery = ref('');
const isSearching = ref(false);

// Проверка валидности запроса
const isValidQuery = computed(() => {
    return searchQuery.value.trim().length > 0 && searchQuery.value.length <= 100;
});

// Защита от инъекций
const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Ограничиваем длину и удаляем потенциально опасные символы
    searchQuery.value = sanitizeQuery(input.value.substring(0, 100));
};

const sanitizeQuery = (query: string): string => {
    // Удаляем специальные HTML символы и потенциально опасные элементы
    return query
        .replace(/</g, '')
        .replace(/>/g, '')
        .replace(/script/gi, '')
        .replace(/onerror/gi, '')
        .replace(/javascript:/gi, '');
};


// Обработчик отправки формы
const handleSubmit = async () => {
    if (!isValidQuery.value) return;

    isSearching.value = true;
    try {
        await videoStore.searchVideos(searchQuery.value.trim());
        // Перенаправляем на страницу с результатами поиска
        router.push({
            path: '/search',
            query: { q: searchQuery.value.trim() }
        });
    } catch (error) {
        console.error('Ошибка поиска:', error);
    } finally {
        isSearching.value = false;
    }
};
</script>