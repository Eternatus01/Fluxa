// @ts-ignore
import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatusCode extends Error {
    statusCode?: number;
    details?: any;
}

export default function errorHandler(
    err: ErrorWithStatusCode,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    // Логирование полной ошибки в консоль сервера
    console.error("Error Details:", err);

    // Определение статуса ошибки (если не указан, используем 500)
    const statusCode: number = err.statusCode || 500;

    // Определение сообщения для пользователя
    const message: string = err.message || "Internal Server Error";

    // Отправка ответа клиенту
    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode,
            details: err.details || null, // Для деталей ошибок валидации
        },
    });
} 