<script setup lang="ts">
import { ref } from 'vue';
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

const handleSubmit = async () => {
    try {
        const params: SignInParams = {
            email: email.value,
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
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <AuthInput v-model="email" type="email" placeholder="Email" />
        <AuthInput v-model="password" type="password" placeholder="Пароль" />
        <div class="flex flex-col gap-4 items-center">
            <AuthButton :is-loading="isLoading" text="Вход" />
            <AuthError :error="error" />
        </div>
    </form>
</template>

<style scoped>
.space-y-4> :not([hidden])~ :not([hidden]) {
    margin-top: 1rem;
}
</style>