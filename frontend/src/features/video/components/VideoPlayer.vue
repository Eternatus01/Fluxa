<template>
    <div class="relative mb-6">
        <video controls class="w-full rounded-lg h-150">
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