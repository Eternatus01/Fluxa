<template>
    <LoadingState v-if="uiStore.isLoading" />
    <AuthFormWrapper v-else title="Авторизация" footerText="Нет аккаунта?" footerLinkText="Зарегистрируйтесь"
        footerLinkTo="/register">
        <LoginForm />
    </AuthFormWrapper>
</template>

<script setup lang="ts">
import AuthFormWrapper from '../components/AuthFormWrapper.vue';
import LoginForm from '../components/LoginForm.vue';
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';
import { useUiStore } from '@/shared/stores/uiStore';
import LoadingState from '@/shared/ui/molecules/LoadingState.vue';

const authStore = useAuthStore();
const uiStore = useUiStore();

onMounted(async () => {
    uiStore.isLoading = true;
    await authStore.checkAuth();
    uiStore.isLoading = false;
});
</script>