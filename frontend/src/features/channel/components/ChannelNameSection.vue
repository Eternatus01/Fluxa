<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { useChangeStore } from '../stores/changeStore';
import { storeToRefs } from 'pinia';
import { ChannelNameParams, ChannelName, ChannelPreviewUpdate } from '../types/channelTypes';

const props = defineProps<{
    initialChannelName?: ChannelName;
}>();

const emit = defineEmits<{
    (e: 'update', data: ChannelPreviewUpdate): void;
}>();

const userStore = useUserStore();
const changeStore = useChangeStore();
const tempChannelName = ref<ChannelName>('');
const { isUpdatingChannelName, updateChannelNameError } = storeToRefs(changeStore);

// Инициализация значения при создании компонента
onMounted(() => {
    if (props.initialChannelName) {
        tempChannelName.value = props.initialChannelName;
    }
});

const uploadChannelName = async () => {
    try {
        if (!tempChannelName.value || !userStore.user_id) return;

        const params: ChannelNameParams = {
            id: userStore.user_id,
            channelName: tempChannelName.value
        };

        await changeStore.updateChannelName(params);

        // Обновляем данные пользователя и отправляем событие обновления
        await userStore.fetchUser();
        emit('update', { type: 'name', value: tempChannelName.value });
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