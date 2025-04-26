<template>
    <div class="channel-playlists-page">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">
                <template v-if="error">
                    <div class="col-span-full">
                        <ErrorState :message="error.message" />
                    </div>
                </template>
                <template v-else>
                    <PlaylistCard v-for="(playlist, index) in playlists" :key="playlist.id" :playlist="playlist"
                        :style="{ 'animation-delay': `${index * 0.05}s` }" class="playlist-card" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/features/user/stores/userStore';
import { usePlaylistStore } from '@/features/playlist/stores/playlistStore';
import { useUiStore } from '@/shared/stores/uiStore';
import ErrorState from '@/shared/ui/molecules/ErrorState.vue';
import PlaylistCard from '@/features/playlist/components/PlaylistCard.vue';

const userStore = useUserStore();
const playlistStore = usePlaylistStore();
const uiStore = useUiStore();
const dataLoaded = ref(false);

const userId = computed(() => userStore.user_id);
const error = computed(() => playlistStore.error);
const playlists = computed(() => playlistStore.playlists);

const fetchPlaylists = async () => {
    if (userId.value && !dataLoaded.value) {
        uiStore.isLoading = true;
        await playlistStore.fetchUserPlaylists(userId.value);
        uiStore.isLoading = false;
        dataLoaded.value = true;
    }
};

onMounted(fetchPlaylists);
</script>

<style scoped>
.channel-playlists-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.playlist-card {
    opacity: 0;
    animation: fadeIn 0.5s ease-out forwards;
}

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
</style>