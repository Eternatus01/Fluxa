<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { useSubscriptionStore } from '../stores/subscription';
import { SubscriptionError } from '../types/subscriptionTypes';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import SubscriptionList from '../components/SubscriptionList.vue';

const userStore = useUserStore();
const subscriptionStore = useSubscriptionStore();
const dataLoaded = ref(false);

const userId = computed(() => userStore.user_id);
const isLoading = computed(() => subscriptionStore.isLoading);
const error = computed(() => subscriptionStore.error);
const subscriptions = computed(() => subscriptionStore.subscriptions);

const fetchSubscriptions = async () => {
    // Проверяем, есть ли пользователь и не загружены ли уже данные
    if (userId.value && !dataLoaded.value) {
        await subscriptionStore.fetchUserSubscriptions(userId.value);
        dataLoaded.value = true;
    }
};

// Отслеживаем изменение userId, чтобы перезагрузить подписки при смене пользователя
watch(() => userId.value, (newUserId, oldUserId) => {
    // Загружаем данные только при изменении userId или если данные еще не загружены
    if (newUserId && (newUserId !== oldUserId || !dataLoaded.value)) {
        dataLoaded.value = false; // Сбрасываем флаг при смене пользователя
        fetchSubscriptions();
    }
});

onMounted(fetchSubscriptions);
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-8">Мои подписки</h1>

        <LoadingState v-if="isLoading" />
        <ErrorState v-else-if="error" :message="error.message" />
        <SubscriptionList v-else :subscriptions="subscriptions" />
    </div>
</template>