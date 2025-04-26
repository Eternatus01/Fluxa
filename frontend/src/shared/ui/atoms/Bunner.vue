<template>
    <div class="banner-wrapper">
        <img class="banner-image" :src="src" alt="Channel Banner">
    </div>
</template>

<script setup lang="ts">
defineProps({
    src: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.banner-wrapper {
    width: 100%;
    position: relative;
    padding-top: 33.33%;
    overflow: hidden;
}

.banner-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
}
</style>