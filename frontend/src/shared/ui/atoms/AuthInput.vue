<script setup lang="ts">
interface Props {
    type: 'text' | 'email' | 'password';
    modelValue: string;
    placeholder: string;
}

defineProps<Props>();
defineEmits(['update:modelValue']);
</script>

<template>
    <div class="input-container">
        <input :type="type" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            class="auth-input" />
        <div class="input-focus-line"></div>
    </div>
</template>

<style scoped>
.input-container {
    position: relative;
    margin-bottom: 0.5rem;
}

.auth-input {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
}

.auth-input:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    background-color: rgba(255, 255, 255, 0.08);
}

.auth-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
    transition: color 0.3s ease;
}

.auth-input:focus::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.input-focus-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    transition: width 0.3s ease, left 0.3s ease;
    border-radius: 2px;
}

.auth-input:focus~.input-focus-line {
    width: 100%;
    left: 0;
}

.auth-input {
    animation: inputAppear 0.5s ease-out;
}

@keyframes inputAppear {
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