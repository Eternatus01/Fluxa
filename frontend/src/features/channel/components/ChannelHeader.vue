<template>
    <div class="channel-header pt-2">
        <div class="content-container">
            <div class="banner-container">
                <Bunner :src="user.bunner_url || '/default-banner.jpg'" />
                <channel-info :user="user" class="overlay-info"></channel-info>
                <button-subscribe v-if="currentUserId && currentUserId !== user.id" class="subscribe-button-position"
                    :id="user.id">
                </button-subscribe>
            </div>
        </div>
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

<style scoped>
.channel-header {
    position: relative;
    margin-bottom: 2rem;
    animation: headerFadeIn 0.8s ease-out;
}

.content-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
}

.banner-container {
    position: relative;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
}

.overlay-info {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    z-index: 10;
}

.subscribe-button-position {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    z-index: 10;
}

@keyframes headerFadeIn {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>