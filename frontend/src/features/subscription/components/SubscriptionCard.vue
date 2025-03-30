<script setup lang="ts">
import type { Subscription } from '../types';
import ButtonSubscribe from '@/shared/ui/atoms/ButtonSubscribe.vue';

defineProps<{
    subscription: Subscription;
}>();
</script>

<template>
    <div class="flex flex-col gap-4 bg-gray-900 p-4 rounded-lg">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <router-link :to="{ name: 'Channel', params: { username: subscription.username } }">
                    <img :src="subscription.avatar_url" class="w-12 h-12 rounded-full object-cover"
                        alt="Channel Avatar">
                </router-link>
                <div>
                    <h3 class="text-lg font-semibold">{{ subscription.channel_name }}</h3>
                    <p class="text-gray-400 text-sm">{{ subscription.subscribers_count }} подписчиков</p>
                </div>
            </div>
            <ButtonSubscribe :id="subscription.id" />
        </div>
    </div>
</template>