<script setup lang="ts">
import { ref, computed } from 'vue';
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

const emailPattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
const usernamePattern = "^[a-zA-Z0-9_]{3,20}$";

const isFormValid = computed(() => {
    return email.value.length > 0 &&
        password.value.length >= 8 &&
        username.value.length >= 3 &&
        channel_name.value.length > 0;
});

const handleSubmit = async () => {
    try {
        if (!isFormValid.value) return;

        const params: SignUpParams = {
            email: email.value.trim(),
            password: password.value,
            username: username.value.trim(),
            channel_name: channel_name.value.trim()
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
            <AuthInput v-model="channel_name" type="text" placeholder="Название канала" maxlength="25"
                class="animate-[fadeIn_0.5s_ease-out_0.1s_both]" />
            <div class="text-xs text-gray-400 -mt-3">Название вашего канала (до 25 символов)</div>

            <AuthInput v-model="username" type="text" placeholder="Username" maxlength="20" minlength="3"
                :pattern="usernamePattern" autocomplete="username" class="animate-[fadeIn_0.5s_ease-out_0.2s_both]" />
            <div class="text-xs text-gray-400 -mt-3">От 3 до 20 символов, только буквы, цифры и _</div>

            <AuthInput v-model="email" type="email" placeholder="Email" maxlength="50" :pattern="emailPattern"
                autocomplete="email" class="animate-[fadeIn_0.5s_ease-out_0.3s_both]" />

            <AuthInput v-model="password" type="password" placeholder="Пароль" maxlength="64" minlength="8"
                autocomplete="new-password" class="animate-[fadeIn_0.5s_ease-out_0.4s_both]" />
            <div class="text-xs text-gray-400 -mt-3">Не менее 8 символов</div>
        </div>

        <div class="flex flex-col gap-4 mt-2 animate-[actionsAppear_0.5s_ease-out_0.5s_both]">
            <AuthButton :is-loading="isLoading" text="Регистрация" :disabled="!isFormValid" />
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