<script setup lang="ts">
interface Props {
    title: string;
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
}

defineProps<Props>();
</script>

<template>
    <div class="min-h-screen">
        <main class="container mx-auto px-4 pt-20">
            <div class="max-w-md mx-auto rounded-lg bg-gray-800 p-8">
                <h2 class="mb-8 text-center text-3xl font-bold">{{ title }}</h2>
                <slot></slot>
                <p class="mt-6 text-center text-sm text-gray-400">
                    {{ footerText }}
                    <router-link :to="footerLinkTo" class="ml-1 text-red-500 hover:text-red-400">
                        {{ footerLinkText }}
                    </router-link>
                </p>
            </div>
        </main>
    </div>
</template>