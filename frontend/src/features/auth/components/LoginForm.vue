<script setup lang="ts">
import { ref, computed } from 'vue';
import AuthInput from '@/shared/ui/atoms/AuthInput.vue';
import AuthButton from '@/shared/ui/atoms/AuthButton.vue';
import AuthError from '@/shared/ui/molecules/AuthError.vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { SignInParams } from '../types/authTypes';

const authStore = useAuthStore();
const { isSigningIn: isLoading, signInError: error } = storeToRefs(authStore);

const email = ref('');
const password = ref('');

const emailPattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";

const isFormValid = computed(() => {
    return email.value.length > 0 && password.value.length >= 8;
});

const handleSubmit = async () => {
    try {
        if (!isFormValid.value) return;

        const params: SignInParams = {
            email: email.value.trim(),
            password: password.value
        };

        await authStore.signIn(params);
        email.value = '';
        password.value = '';
    } catch (error) {
        // Ошибка обрабатывается в хранилище
    }
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
            <AuthInput v-model="email" type="email" placeholder="Email" maxlength="100" :pattern="emailPattern"
                autocomplete="email" class="animate-[fadeIn_0.5s_ease-out_0.1s_both]" />
            <AuthInput v-model="password" type="password" placeholder="Пароль" maxlength="64"
                autocomplete="current-password" class="animate-[fadeIn_0.5s_ease-out_0.2s_both]" />
        </div>

        <div class="flex flex-col gap-4 mt-2 animate-[actionsAppear_0.5s_ease-out_0.3s_both]">
            <AuthButton :is-loading="isLoading" text="Вход" :disabled="!isFormValid" />
            <AuthError :error="error" />
        </div>
    </form>
</template>

<style>
@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes actionsAppear {
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