<template>
    <main class="flex min-h-screen">
        <Sidebar />
        <section class="flex-1 px-4 mt-4">
            <div v-if="searchQuery" class="mt-6 mb-4">
                <h2 class="text-xl font-semibold text-white/90">
                    Результаты поиска для "{{ searchQuery }}"
                </h2>
            </div>

            <router-view />
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const searchQuery = computed(() => route.query.search as string);
</script>