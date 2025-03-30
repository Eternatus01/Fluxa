<script setup lang="ts">
interface Props {
    error: { message: string } | null;
}

defineProps<Props>();
</script>

<template>
    <div v-if="error" class="error-container">
        <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd" />
        </svg>
        <p class="error-message">{{ error.message }}</p>
    </div>
</template>

<style scoped>
.error-container {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    margin-top: 0.5rem;
    animation: errorAppear 0.3s ease-out;
}

.error-icon {
    width: 20px;
    height: 20px;
    color: rgb(239, 68, 68);
    margin-right: 0.625rem;
    flex-shrink: 0;
}

.error-message {
    color: rgb(239, 68, 68);
    font-size: 0.875rem;
    font-weight: 500;
}

@keyframes errorAppear {
    0% {
        opacity: 0;
        transform: translateY(-5px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>