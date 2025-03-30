export default function errorHandler(err, req, res, next) {
  // Логирование полной ошибки в консоль сервера
  console.error("Error Details:", err);

  // Определение статуса ошибки (если не указан, используем 500)
  const statusCode = err.statusCode || 500;

  // Определение сообщения для пользователя
  const message = err.message || "Internal Server Error";

  // Отправка ответа клиенту
  res.status(statusCode).json({
    error: {
      message: message,
      status: statusCode,
      details: err.details || null, // Для деталей ошибок валидации
    },
  });
}
