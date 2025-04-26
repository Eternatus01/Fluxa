<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { useChangeStore } from '../stores/changeStore';
import { storeToRefs } from 'pinia';
import { ChannelNameParams, ChannelName, ChannelPreviewUpdate } from '../types/channelTypes';

const props = defineProps<{
    initialChannelName?: ChannelName;
}>();

const emit = defineEmits<{
    (e: 'update', data: ChannelPreviewUpdate): void;
    (e: 'save', channelName: string): void;
}>();

const MAX_CHANNEL_NAME_LENGTH = 50;
const MIN_CHANNEL_NAME_LENGTH = 3;

const userStore = useUserStore();
const changeStore = useChangeStore();
const tempChannelName = ref<ChannelName>('');
const { isUpdatingChannelName, updateChannelNameError } = storeToRefs(changeStore);

// Проверка валидности имени канала
const isValidChannelName = computed(() => {
    const value = tempChannelName.value?.trim() || '';
    return value.length >= MIN_CHANNEL_NAME_LENGTH &&
        value.length <= MAX_CHANNEL_NAME_LENGTH &&
        /^[a-zA-Z0-9а-яА-ЯёЁ\s\-_]+$/u.test(value);
});

// Инициализация значения при создании компонента
onMounted(() => {
    if (props.initialChannelName) {
        tempChannelName.value = props.initialChannelName;
    }
});

// Обработчик ввода для санитизации данных
const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Обрезаем длину и фильтруем специальные символы
    tempChannelName.value = sanitizeChannelName(input.value.substring(0, MAX_CHANNEL_NAME_LENGTH));
    emit('update', { type: 'name', value: tempChannelName.value });
};

// Функция очистки имени канала от потенциально опасных символов
const sanitizeChannelName = (name: string): string => {
    return name
        .replace(/<[^>]*>/g, '') // Удаляем HTML теги
        .replace(/[^\w\sа-яА-ЯёЁ\-_]/gu, ''); // Оставляем только буквы, цифры, пробелы и некоторые символы
};

// Публично доступная функция для получения имени
const getChannelName = () => {
    return isValidChannelName.value ? tempChannelName.value.trim() : null;
};

// Экспортируем функцию для сохранения имени, которая будет вызвана из родительского компонента
defineExpose({ getChannelName });
</script>

<template>
    <div>
        <div class="mb-4">
            <input id="channelName" v-model="tempChannelName" @input="handleInput" type="text" maxlength="50"
                minlength="3" placeholder="Введите название канала"
                class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                :class="{ 'border-red-500': !isValidChannelName && tempChannelName.length > 0 }">
            <div class="flex justify-between mt-1">
                <div>
                    <p v-if="updateChannelNameError" class="text-red-500 text-xs">{{ updateChannelNameError }}</p>
                    <p v-else-if="!isValidChannelName && tempChannelName.length > 0" class="text-red-500 text-xs">
                        Имя канала должно содержать от {{ MIN_CHANNEL_NAME_LENGTH }} до {{ MAX_CHANNEL_NAME_LENGTH }}
                        символов без специальных символов
                    </p>
                    <p v-else-if="isUpdatingChannelName" class="text-gray-400 text-xs">Сохранение...</p>
                    <p v-else class="text-gray-400 text-xs">Это имя будет отображаться на вашем канале и в комментариях
                    </p>
                </div>
                <div class="text-xs text-gray-500">{{ tempChannelName.length }}/{{ MAX_CHANNEL_NAME_LENGTH }}</div>
            </div>
        </div>
    </div>
</template>