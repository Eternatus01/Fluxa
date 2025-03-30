export function formatViews(views: number | undefined): string {
    if (!views) return '0 просмотров';

    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M просмотров`;
    } else if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K просмотров`;
    }
    return `${views} просмотров`;
}

export function timeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = now.getTime() - past.getTime();

    if (elapsed < msPerMinute) {
        const seconds = Math.round(elapsed / 1000);
        return `${seconds} секунд назад`;
    } else if (elapsed < msPerHour) {
        const minutes = Math.round(elapsed / msPerMinute);
        return `${minutes} минут назад`;
    } else if (elapsed < msPerDay) {
        const hours = Math.round(elapsed / msPerHour);
        return `${hours} часов назад`;
    } else if (elapsed < msPerMonth) {
        const days = Math.round(elapsed / msPerDay);
        return `${days} дней назад`;
    } else if (elapsed < msPerYear) {
        const months = Math.round(elapsed / msPerMonth);
        return `${months} месяцев назад`;
    } else {
        const years = Math.round(elapsed / msPerYear);
        return `${years} лет назад`;
    }
} 