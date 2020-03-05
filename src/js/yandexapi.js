const apiKey = '0eb99fab-2001-47b8-9c4d-eb4abb8f5daf';

function getApiConstructor() {
    return `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
}

getApiConstructor();