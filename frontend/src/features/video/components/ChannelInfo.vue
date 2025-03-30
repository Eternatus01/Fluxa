<template>
    <div class="flex flex-col gap-4 bg-gray-900 p-4 rounded-lg" v-if="user">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <router-link :to="{ name: 'Channel', params: { username: user.username } }">
                    <Avatar :src="user.avatar_url" />
                </router-link>
                <div>
                    <h3 class="text-lg font-semibold">{{ user.channel_name }}</h3>
                    <p class="text-gray-400 text-sm">{{ user.subscribers_count }} подписчиков</p>
                </div>
            </div>
            <button-subscribe :id="user.id"></button-subscribe>
            <button-edit-video :user_id="user.id" :video_id="video.id"></button-edit-video>
        </div>
        <div>
            <div class="video-description">
                {{ video.description }}
            </div>
            <div v-if="video.tags?.length" class="mb-6">
                <h3 class="mb-2 mt-4">Теги видео:</h3>
                <div class="flex flex-wrap gap-2">
                    <span v-for="(tag, index) in video.tags" :key="index"
                        class="text-gray-900 inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-300 transition-colors cursor-pointer">
                        #{{ tag }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from './../../../shared/ui/atoms/Avatar.vue';
import ButtonSubscribe from './../../../shared/ui/atoms/ButtonSubscribe.vue';
import ButtonEditVideo from '../../../shared/ui/atoms/ButtonEditVideo.vue';

defineProps<{
    user: UserData,
    video: Video,
}>()
</script>

<style>
.video-description {
    white-space: pre-line;
}
</style>