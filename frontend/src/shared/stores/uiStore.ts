import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    return { isLoading, error };
}); 