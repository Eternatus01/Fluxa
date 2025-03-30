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
    <div class="min-h-screen bg-[#0f0f0f]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-2xl font-bold text-white mb-6">Мои подписки</h1>

            <div class="rounded-xl overflow-hidden">
                <LoadingState v-if="isLoading" />
                <ErrorState v-else-if="error" :message="error.message" />
                <SubscriptionList v-else :subscriptions="subscriptions" class="animate-fade-in" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}
</style>