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
    <div class="min-h-screen flex items-center justify-center">
        <main class="container mx-auto">
            <div
                class="max-w-[450px] w-full mx-auto p-10 rounded-2xl bg-[rgba(17,25,40,0.75)] backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 transform translate-y-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <h2 class="text-4xl font-bold text-center mb-8 text-white">
                    {{ title }}</h2>
                <slot></slot>
                <p class="mt-6 text-center text-sm text-white/70">
                    {{ footerText }}
                    <router-link :to="footerLinkTo"
                        class="ml-1 text-blue-400 font-medium hover:text-blue-300 transition-colors relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-[-2px] after:left-0 after:bg-blue-400 after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                        {{ footerLinkText }}
                    </router-link>
                </p>
            </div>
        </main>
    </div>
</template>

<style>
@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes cardAppear {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes titleAppear {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-gradient {
    animation: gradientShift 15s ease infinite;
}

.animate-card-appear {
    animation: cardAppear 0.6s ease-out;
}

.animate-title-appear {
    animation: titleAppear 0.8s ease-out;
}
</style>