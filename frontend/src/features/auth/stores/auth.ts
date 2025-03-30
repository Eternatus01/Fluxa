import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthApi } from '../composable/useAuthApi';
import { useUserStore } from '../../user/stores/userStore';
import {
  SignUpParams,
  SignInParams,
  AuthError,
  AuthState
} from '../types/authTypes';
import { UserData } from '../../user/types/userTypes';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const authApi = useAuthApi();
  const userStore = useUserStore();

  // Состояние согласно AuthState
  const isCheckingAuth = ref<boolean>(false);
  const isSigningUp = ref<boolean>(false);
  const isSigningIn = ref<boolean>(false);
  const isSigningOut = ref<boolean>(false);
  const signUpError = ref<AuthError | null>(null);
  const signInError = ref<AuthError | null>(null);
  const signOutError = ref<AuthError | null>(null);

  const checkAuth = async (): Promise<UserData | null> => {
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

  const signUp = async (params: SignUpParams): Promise<UserData> => {
    isSigningUp.value = true;
    signUpError.value = null;
    try {
      const data = await authApi.signUp(
        params.email, params.password, params.username, params.channel_name
      );
      userStore.setUser(data);
      router.push('/');
      return data;
    } catch (error) {
      signUpError.value = error as AuthError;
      throw error;
    } finally {
      isSigningUp.value = false;
    }
  };

  const signIn = async (params: SignInParams): Promise<UserData> => {
    isSigningIn.value = true;
    signInError.value = null;
    try {
      const data = await authApi.signIn(params.email, params.password);
      userStore.setUser(data);
      router.push('/');
      return data;
    } catch (error) {
      signInError.value = error as AuthError;
      throw error;
    } finally {
      isSigningIn.value = false;
    }
  };

  const signOut = async (): Promise<void> => {
    isSigningOut.value = true;
    signOutError.value = null;
    try {
      await authApi.signOut();
      userStore.clearUser();
      router.push('/');
    } catch (error) {
      signOutError.value = error as AuthError;
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