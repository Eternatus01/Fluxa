export function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        год: 31536000,
        месяц: 2592000,
        неделя: 604800,
        день: 86400,
        час: 3600,
        минута: 60,
        секунда: 1
    };

    function pluralize(number: number, unit) {
        const cases = {
            год: ['лет', 'год', 'года'],
            месяц: ['месяцев', 'месяц', 'месяца'],
            неделя: ['недель', 'неделя', 'недели'],
            день: ['дней', 'день', 'дня'],
            час: ['часов', 'час', 'часа'],
            минута: ['минут', 'минута', 'минуты'],
            секунда: ['секунд', 'секунда', 'секунды']
        };

        if (number === 0) return 'только что';
        number = Math.floor(number);
        const form = cases[unit][
            number % 10 === 1 && number % 100 !== 11 ? 1 :
                [2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100) ? 2 : 0
        ];
        return `${number} ${form} назад`;
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = seconds / secondsInUnit;
        if (interval >= 1) {
            return pluralize(interval, unit);
        }
    }
    return 'только что';
}