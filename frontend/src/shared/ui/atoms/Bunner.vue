<template>
    <div>
        <img class="h-100 bg-cover bg-center container mx-auto rounded-xl" :src="src" alt="">
        <div class="absolute inset-0 bg-black opacity-36 rounded-lg"></div>
    </div>
</template>

<script setup>
defineProps({
    src: {
        type: String,
        required: true,
    },
});
</script>