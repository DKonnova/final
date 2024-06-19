const MONTH_LIST = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
];

export function getDateString(rawData) {
    let date = new Date(Date.parse(rawData));
    return `${date.getDate()} ${MONTH_LIST[date.getMonth()]} ${date.getFullYear()}`;
}

