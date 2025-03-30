import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthApi } from '../composable/useAuthApi';
import { useUserStore } from '../../user/stores/userStore';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const authApi = useAuthApi();
  const userStore = useUserStore();

  const isCheckingAuth = ref(false);
  const isSigningUp = ref(false);
  const isSigningIn = ref(false);
  const isSigningOut = ref(false);
  const signUpError = ref<Error | null>(null);
  const signInError = ref<Error | null>(null);
  const signOutError = ref<Error | null>(null);

  const checkAuth = async () => {
    if (isCheckingAuth.value) return null;

    isCheckingAuth.value = true;
    try {
      // Если у нас уже есть пользователь в хранилище, не делаем запрос
      if (userStore.user) {
        return userStore.user;
      }

      const userData = await authApi.getCurrentUser();

      if (userData) {
        userStore.setUser(userData);
        return userData;
      }

      return null;
    } catch (error) {
      return null;
    } finally {
      isCheckingAuth.value = false;
    }
  };

  const signUp = async ({ email, password, username, channel_name }: { email: string, password: string, username: string, channel_name: string }) => {
    isSigningUp.value = true;
    signUpError.value = null;
    try {
      const data = await authApi.signUp(email, password, username, channel_name);
      userStore.setUser(data);
      router.push('/');
      return data;
    } catch (error) {
      signUpError.value = error as Error;
      throw error;
    } finally {
      isSigningUp.value = false;
    }
  };

  const signIn = async ({ email, password }: { email: string, password: string }) => {
    isSigningIn.value = true;
    signInError.value = null;
    try {
      const data = await authApi.signIn(email, password);
      userStore.setUser(data);
      router.push('/');
      return data;
    } catch (error) {
      signInError.value = error as Error;
      throw error;
    } finally {
      isSigningIn.value = false;
    }
  };

  const signOut = async () => {
    isSigningOut.value = true;
    signOutError.value = null;
    try {
      await authApi.signOut();
      userStore.clearUser();
      router.push('/');
    } catch (error) {
      signOutError.value = error as Error;
      throw error;
    } finally {
      isSigningOut.value = false;
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    checkAuth,
    isSigningUp: computed(() => isSigningUp.value),
    isSigningIn: computed(() => isSigningIn.value),
    isSigningOut: computed(() => isSigningOut.value),
    isCheckingAuth: computed(() => isCheckingAuth.value),
    signUpError: computed(() => signUpError.value),
    signInError: computed(() => signInError.value),
    signOutError: computed(() => signOutError.value),
    isAuthenticated: computed(() => !!userStore.user),
  };
});