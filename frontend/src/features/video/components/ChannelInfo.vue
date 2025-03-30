<template>
    <div class="bg-[#1e1e1e]/60 rounded-lg overflow-hidden" v-if="user">
        <!-- Верхняя часть с информацией о канале -->
        <div class="p-4 md:p-5 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <router-link :to="{ name: 'Channel', params: { username: user.username } }" class="flex-shrink-0">
                    <Avatar :src="user.avatar_url"
                        class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-transparent hover:border-blue-500/50 transition-all duration-300" />
                </router-link>
                <div>
                    <router-link :to="{ name: 'Channel', params: { username: user.username } }" class="group">
                        <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{{
                            user.channel_name }}</h3>
                    </router-link>
                    <p class="text-gray-400 text-sm">{{ user.subscribers_count }} подписчиков</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <button-subscribe :id="user.id" class="flex-shrink-0"></button-subscribe>
                <button-edit-video :user_id="user.id" :video_id="video.id" class="flex-shrink-0"></button-edit-video>
            </div>
        </div>

        <!-- Нижняя часть с описанием и тегами -->
        <div class="px-4 md:px-5 pb-5" v-if="video.description || video.tags?.length">
            <div class="text-gray-300 video-description mt-1 mb-4 text-sm leading-relaxed" v-if="video.description">
                {{ video.description }}
            </div>

            <div v-if="video.tags?.length" class="mt-4">
                <h3 class="text-sm font-medium text-gray-400 mb-2">Теги:</h3>
                <div class="flex flex-wrap gap-2">
                    <span v-for="(tag, index) in video.tags" :key="index"
                        class="bg-[#252525] text-blue-400 inline-flex items-center px-3 py-1 rounded-full text-xs hover:bg-[#303030] transition-colors cursor-pointer">
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