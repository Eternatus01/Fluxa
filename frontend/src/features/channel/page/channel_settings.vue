<template>
    <div class="min-h-screen bg-dark-100">
        <div class="container mx-auto py-8 px-4 md:px-6">
            <!-- Заголовок страницы -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-white">Настройки канала</h1>
                    <p class="text-white/60 mt-2">Управляйте внешним видом и информацией вашего канала</p>
                </div>
            </div>

            <!-- Основной контент -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Превью канала -->
                <div class="lg:col-span-1">
                    <div class="bg-dark-200 rounded-xl sticky top-8">
                        <h2 class="text-xl font-semibold text-white mb-4">Предпросмотр</h2>
                        <div class="relative">
                            <!-- Баннер -->
                            <div class="w-full h-48 rounded-lg overflow-hidden mb-4">
                                <img :src="channelBanner || '/default-banner.jpg'" class="w-full h-full object-cover"
                                    alt="Channel Banner">
                            </div>
                            <!-- Аватар -->
                            <div class="absolute -bottom-4 left-4">
                                <img :src="channelAvatar || '/default-avatar.jpg'" class="w-20 h-20 rounded-full"
                                    alt="Channel Avatar">
                            </div>
                        </div>
                        <!-- Название канала -->
                        <div class="mt-8">
                            <h3 class="text-lg font-medium text-white">{{ channelName || 'Название канала' }}</h3>
                            <p class="text-white/60 text-sm mt-1">@{{ userStore.user?.username || '@username' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Настройки -->
                <div class="lg:col-span-2">
                    <div class="bg-dark-200 rounded-xl divide-y divide-white/10">
                        <!-- Секция названия канала -->
                        <div class="p-6">
                            <ChannelNameSection :initial-channel-name="channelName" @update="updatePreview" />
                        </div>
                        <!-- Секция аватара -->
                        <div class="p-6">
                            <ChannelAvatarSection :avatar-url="channelAvatar" @update="updatePreview" />
                        </div>
                        <!-- Секция баннера -->
                        <div class="p-6">
                            <ChannelBannerSection :banner-url="channelBanner" @update="updatePreview" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/features/user/stores/userStore'
import ChannelNameSection from '../components/ChannelNameSection.vue'
import ChannelAvatarSection from '../components/ChannelAvatarSection.vue'
import ChannelBannerSection from '../components/ChannelBannerSection.vue'
import { ChannelPreviewData, ChannelPreviewUpdate } from '../types/channelTypes'

const userStore = useUserStore()

// Локальное состояние для предпросмотра
const previewData = ref<ChannelPreviewData>({
    channelName: '',
    avatarUrl: '',
    bannerUrl: ''
})

// Исходные данные
const channelAvatar = computed(() => previewData.value.avatarUrl || userStore.avatar_url)
const channelBanner = computed(() => previewData.value.bannerUrl || userStore.bunner_url)
const channelName = computed(() => previewData.value.channelName || userStore.channel_name)

// Обновление предпросмотра
const updatePreview = (data: ChannelPreviewUpdate) => {
    switch (data.type) {
        case 'name':
            previewData.value.channelName = data.value
            break
        case 'avatar':
            previewData.value.avatarUrl = data.value
            break
        case 'banner':
            previewData.value.bannerUrl = data.value
            break
    }
}

// Добавляем проверку на наличие данных пользователя при монтировании
onMounted(async () => {
    await userStore.fetchUser()
})
</script>

<style scoped>
.bg-cover {
    background-size: cover;
    background-position: top;
}
</style>