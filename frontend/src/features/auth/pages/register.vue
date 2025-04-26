<template>
    <LoadingState v-if="uiStore.isLoading" />
    <AuthFormWrapper v-else title="Регистрация" footerText="Уже есть аккаунт?" footerLinkText="Войдите"
        footerLinkTo="/login">
        <RegisterForm />
    </AuthFormWrapper>
</template>

<script setup lang="ts">
import AuthFormWrapper from '../components/AuthFormWrapper.vue';
import RegisterForm from '../components/RegisterForm.vue';
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