<template>
    <div class="relative bg-cover container mx-auto">
        <Bunner :src="user.bunner_url || '/default-banner.jpg'"></Bunner>
        <channel-info :user="user"></channel-info>
        <button-subscribe v-if="currentUserId && currentUserId !== user.id" class="absolute bottom-8 left-8"
            :id="user.id">
        </button-subscribe>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '../../user/stores/userStore';
import ButtonSubscribe from './../../../shared/ui/atoms/ButtonSubscribe.vue';
import Bunner from './../../../shared/ui/atoms/Bunner.vue';
import ChannelInfo from './ChannelInfo.vue';

const userStore = useUserStore();
const currentUserId = computed(() => userStore.user_id);

defineProps<{
    user: UserData,
}>();
</script>

<style scoped></style>