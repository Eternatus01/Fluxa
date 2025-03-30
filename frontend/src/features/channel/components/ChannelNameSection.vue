<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { useChangeStore } from '../stores/changeStore';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    initialChannelName?: string;
}>();

const userStore = useUserStore();
const changeStore = useChangeStore();
const tempChannelName = ref('');
const { isUpdatingChannelName, updateChannelNameError } = storeToRefs(changeStore);

const uploadChannelName = async () => {
    try {
        if (!tempChannelName.value || !userStore.user_id) return;

        await changeStore.updateChannelName({
            id: userStore.user_id,
            channelName: tempChannelName.value
        });

        await userStore.fetchUser();
        tempChannelName.value = '';
    } catch (error) {
        // Ошибка обрабатывается в сторе
    }
};
</script>

<template>
    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Название канала</h2>
        <input v-model="tempChannelName" type="text"
            class="w-full max-w-md bg-gray-800 rounded-lg p-3 mb-4 text-white border border-gray-700 focus:outline-none focus:border-purple-600"
            :placeholder="initialChannelName || 'Введите название канала'">
        <div>
            <button @click="uploadChannelName"
                :disabled="isUpdatingChannelName || !tempChannelName || tempChannelName.length <= 0"
                class="bg-red-700 px-4 py-2 rounded-full cursor-pointer hover:bg-red-600 disabled:bg-gray-700 disabled:cursor-not-allowed">
                {{ isUpdatingChannelName ? 'Обновление...' : 'Сменить имя' }}
            </button>
            <p v-if="updateChannelNameError" class="text-red-500 mt-2">
                {{ updateChannelNameError.message || 'Произошла ошибка при обновлении названия канала' }}
            </p>
        </div>
    </div>
</template>