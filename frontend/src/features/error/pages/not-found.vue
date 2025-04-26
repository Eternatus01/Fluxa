<template>
    <div class="not-found">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>Извините, запрашиваемая страница не существует.</p>
        <router-link to="/" class="home-link">Вернуться на главную</router-link>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    text-align: center;
    padding: 2rem;
}

h1 {
    font-size: 6rem;
    margin-bottom: 0;
    color: #e53935;
}

h2 {
    font-size: 2rem;
    margin-top: 0.5rem;
}

.home-link {
    margin-top: 2rem;
    padding: 0.75rem 1.5rem;
    background-color: #3f51b5;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.3s;
}

.home-link:hover {
    background-color: #303f9f;
}
</style>