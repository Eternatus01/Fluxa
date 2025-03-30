<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { useSubscriptionStore } from '../stores/subscription';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import SubscriptionList from '../components/SubscriptionList.vue';

const userStore = useUserStore();
const subscriptionStore = useSubscriptionStore();

const userId = computed(() => userStore.user_id);
const isLoading = computed(() => subscriptionStore.isLoading);
const error = computed(() => subscriptionStore.error);
const subscriptions = computed(() => subscriptionStore.subscriptions);

const fetchSubscriptions = async () => {
    if (userId.value) {
        await subscriptionStore.fetchUserSubscriptions(userId.value);
    }
};

watch(userId, fetchSubscriptions);

onMounted(fetchSubscriptions);
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold mb-8">Мои подписки</h1>

        <LoadingState v-if="isLoading" />
        <ErrorState v-else-if="error" :error="error" />
        <SubscriptionList v-else :subscriptions="subscriptions" />
    </div>
</template>