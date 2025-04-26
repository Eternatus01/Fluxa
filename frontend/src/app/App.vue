<template>
  <div>
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../features/auth/stores/auth";
import { onMounted } from "vue";
import HeaderComponent from "../shared/ui/organisms/HeaderComponent.vue";

const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authStore.checkAuth();
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
  }
});
</script>

<style scoped></style>
