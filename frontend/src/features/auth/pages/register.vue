<template>
    <AuthFormWrapper title="Регистрация" footerText="Уже есть аккаунт?" footerLinkText="Войдите" footerLinkTo="/login">
        <RegisterForm />
    </AuthFormWrapper>
</template>

<script setup lang="ts">
import AuthFormWrapper from '../components/AuthFormWrapper.vue';
import RegisterForm from '../components/RegisterForm.vue';
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
    authStore.checkAuth();
});
</script>