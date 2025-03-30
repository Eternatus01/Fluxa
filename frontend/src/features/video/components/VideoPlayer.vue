<template>
    <div class="relative mb-6 overflow-hidden rounded-lg shadow-xl">
        <video controls class="w-full h-auto aspect-video bg-black/90" preload="metadata">
            <source :src="video.video_url" type="video/mp4">
            Ваш браузер не поддерживает видео.
        </video>
    </div>
</template>

<script setup>
defineProps({
    video: {
        type: Object,
        required: true,
    },
});
</script>