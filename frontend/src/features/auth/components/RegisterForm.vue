<script setup lang="ts">
import { ref } from 'vue';
import AuthInput from '@/shared/ui/atoms/AuthInput.vue';
import AuthButton from '@/shared/ui/atoms/AuthButton.vue';
import AuthError from '@/shared/ui/molecules/AuthError.vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isLoading, currentError } = storeToRefs(authStore);

const email = ref('');
const password = ref('');
const username = ref('');
const channel_name = ref('');

const handleSubmit = async () => {
    try {
        await authStore.signUp({
            email: email.value,
            password: password.value,
            username: username.value,
            channel_name: channel_name.value
        });
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
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <AuthInput v-model="channel_name" type="text" placeholder="Название канала" />
        <AuthInput v-model="username" type="text" placeholder="Username" />
        <AuthInput v-model="email" type="email" placeholder="Email" />
        <AuthInput v-model="password" type="password" placeholder="Пароль" />
        <div class="flex flex-col gap-4 items-center">
            <AuthButton :is-loading="isLoading" text="Регистрация" />
            <AuthError :error="currentError" />
        </div>
    </form>
</template>

<style scoped>
.space-y-4> :not([hidden])~ :not([hidden]) {
    margin-top: 1rem;
}
</style>