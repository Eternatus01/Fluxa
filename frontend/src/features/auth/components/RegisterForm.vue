<script setup lang="ts">
import { ref } from 'vue';
import AuthInput from '@/shared/ui/atoms/AuthInput.vue';
import AuthButton from '@/shared/ui/atoms/AuthButton.vue';
import AuthError from '@/shared/ui/molecules/AuthError.vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { SignUpParams } from '../types/authTypes';

const authStore = useAuthStore();
const { isSigningUp: isLoading, signUpError: error } = storeToRefs(authStore);

const email = ref('');
const password = ref('');
const username = ref('');
const channel_name = ref('');

const handleSubmit = async () => {
    try {
        const params: SignUpParams = {
            email: email.value,
            password: password.value,
            username: username.value,
            channel_name: channel_name.value
        };

        await authStore.signUp(params);
        email.value = '';
        password.value = '';
        username.value = '';
        channel_name.value = '';
    } catch (error) {
        // Ошибка обрабатывается в хранилище
    }
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">
            <AuthInput v-model="channel_name" type="text" placeholder="Название канала"
                class="animate-[fadeIn_0.5s_ease-out_0.1s_both]" />
            <AuthInput v-model="username" type="text" placeholder="Username"
                class="animate-[fadeIn_0.5s_ease-out_0.2s_both]" />
            <AuthInput v-model="email" type="email" placeholder="Email"
                class="animate-[fadeIn_0.5s_ease-out_0.3s_both]" />
            <AuthInput v-model="password" type="password" placeholder="Пароль"
                class="animate-[fadeIn_0.5s_ease-out_0.4s_both]" />
        </div>

        <div class="flex flex-col gap-4 mt-2 animate-[actionsAppear_0.5s_ease-out_0.5s_both]">
            <AuthButton :is-loading="isLoading" text="Регистрация" />
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