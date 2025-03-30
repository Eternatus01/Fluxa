# Fluxa

Полнофункциональное веб-приложение с Vue 3 (фронтенд) и Node.js (бэкенд).

## Структура проекта

- **frontend/** - Vue 3 + TypeScript + Vite приложение
- **backend/** - Node.js бэкенд на базе Express/Bun

## Установка и запуск

### Бэкенд

```bash
cd backend
npm install
# или
bun install

# Запуск
npm start
# или
bun run dev
```

### Фронтенд

```bash
cd frontend
npm install
# или
bun install

# Запуск в режиме разработки
npm run dev
# или
bun run dev
```

## Окружение

Создайте файл `.env` в папке backend со следующими переменными:

```
PORT=3000
DATABASE_URL=...
```

## Лицензия

MIT 