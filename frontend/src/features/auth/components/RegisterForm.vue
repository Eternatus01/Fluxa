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
    <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-fields">
            <AuthInput v-model="channel_name" type="text" placeholder="Название канала" />
            <AuthInput v-model="username" type="text" placeholder="Username" />
            <AuthInput v-model="email" type="email" placeholder="Email" />
            <AuthInput v-model="password" type="password" placeholder="Пароль" />
        </div>

        <div class="form-actions">
            <AuthButton :is-loading="isLoading" text="Регистрация" />
            <AuthError :error="error" />
        </div>
    </form>
</template>

<style scoped>
.register-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-fields> :nth-child(1) {
    animation-delay: 0.1s;
}

.form-fields> :nth-child(2) {
    animation-delay: 0.2s;
}

.form-fields> :nth-child(3) {
    animation-delay: 0.3s;
}

.form-fields> :nth-child(4) {
    animation-delay: 0.4s;
}

.form-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
    animation: actionsAppear 0.5s ease-out 0.5s both;
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