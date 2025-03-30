<template>
  <div>
    <header-component></header-component>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "../features/user/stores/userStore";
import { useAuthStore } from "../features/auth/stores/auth";
import { onMounted } from "vue";
import HeaderComponent from "../shared/ui/organisms/HeaderComponent.vue";

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(async () => {
  try {
    // Сначала проверяем авторизацию
    await authStore.checkAuth();

    // Затем, только если пользователь авторизован, загружаем его данные
    if (userStore.user) {
      await userStore.fetchUser();
    }
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
  }
});
</script>

<style scoped></style>
