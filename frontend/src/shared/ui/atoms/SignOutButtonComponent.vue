<template>
    <router-link to="/login" @click="handleSignOut"
        class="block px-4 py-2 text-white hover:bg-gray-700 hover:text-red-500">
        Выход
    </router-link>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../../features/auth/stores/auth';
const authStore = useAuthStore();

const handleSignOut = () => {
    authStore.signOut();
}
</script>

<style scoped></style>