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
    <div class="auth-wrapper">
        <main class="container mx-auto px-4 pt-20">
            <div class="auth-card">
                <h2 class="auth-title">{{ title }}</h2>
                <slot></slot>
                <p class="auth-footer">
                    {{ footerText }}
                    <router-link :to="footerLinkTo" class="auth-link">
                        {{ footerLinkText }}
                    </router-link>
                </p>
            </div>
        </main>
    </div>
</template>

<style scoped>
.auth-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: gradientShift 15s ease infinite;
    background-size: 400% 400%;
}

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

.auth-card {
    max-width: 450px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem;
    border-radius: 16px;
    background: rgba(17, 25, 40, 0.75);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transform: translateY(0);
    transition: all 0.3s ease;
    animation: cardAppear 0.6s ease-out;
}

.auth-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
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

.auth-title {
    font-size: 2rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    animation: titleAppear 0.8s ease-out;
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

.auth-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
}

.auth-link {
    margin-left: 0.25rem;
    color: #3b82f6;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
}

.auth-link:hover {
    color: #60a5fa;
}

.auth-link::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: #60a5fa;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
}

.auth-link:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}
</style>