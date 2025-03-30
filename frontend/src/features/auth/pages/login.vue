<template>
    <AuthFormWrapper title="Авторизация" footerText="Нет аккаунта?" footerLinkText="Зарегистрируйтесь"
        footerLinkTo="/register">
        <LoginForm />
    </AuthFormWrapper>
</template>

<script setup lang="ts">
import AuthFormWrapper from '../components/AuthFormWrapper.vue';
import LoginForm from '../components/LoginForm.vue';
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
    authStore.checkAuth();
});
</script>