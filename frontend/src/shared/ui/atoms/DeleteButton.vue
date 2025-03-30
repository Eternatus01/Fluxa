<template>
    <button @click="handleClick" class="delete-button flex items-center">
        Удалить
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    onClick: () => void;
}>();

const handleClick = () => {
    props.onClick();
};
</script>

<style scoped>
.delete-button {
    color: red;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}
</style>