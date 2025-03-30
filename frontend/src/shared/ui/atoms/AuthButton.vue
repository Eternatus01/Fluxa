<script setup lang="ts">
interface Props {
    isLoading?: boolean;
    text: string;
    loadingText?: string;
}

withDefaults(defineProps<Props>(), {
    loadingText: 'Загрузка...',
    isLoading: false
});
</script>

<template>
    <button type="submit" :disabled="isLoading" class="auth-button">
        <span class="button-content">
            <span v-if="isLoading" class="loader"></span>
            <span>{{ isLoading ? loadingText : text }}</span>
        </span>
    </button>
</template>

<style scoped>
.auth-button {
    width: 100%;
    position: relative;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    animation: buttonAppear 0.5s ease-out;
}

.auth-button:hover {
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
    transform: translateY(-2px);
}

.auth-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

.auth-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.auth-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent);
    transition: all 0.6s ease;
}

.auth-button:hover::before {
    left: 100%;
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.loader {
    width: 18px;
    height: 18px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes buttonAppear {
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