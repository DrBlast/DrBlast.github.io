const balloonTpl = require('../templates/balloon.hbs');

const init = () => {

    const balloonLayout = ymaps.templateLayoutFactory.createClass(balloonTpl(), {
        build: function () {
            balloonLayout.superclass.build.call(this);
            const closeButton = document.querySelector('.btn-close');

            closeButton.addEventListener('click', () => {
                this.closeBalloon();
            })
        },
        clear: function () {
            balloonLayout.superclass.clear.call(this);
        },
        closeBalloon: function () {
            this.events.fire('userclose');
        }
    });

    let map = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),

        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(balloonTpl),

        // Создание метки с пользовательским макетом балуна.
        myPlacemark = window.myPlacemark = new ymaps.Placemark(map.getCenter(), {
            balloonHeader: 'Заголовок балуна',
            balloonContent: 'Контент балуна'
        }, {
            balloonShadow: false,
            balloonLayout: balloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            balloonPanelMaxMapArea: 0
            // Не скрываем иконку при открытом балуне.
            // hideIconOnBalloonOpen: false,
            // И дополнительно смещаем балун, для открытия над иконкой.
            // balloonOffset: [3, -40]
        });

    map.geoObjects.add(myPlacemark);
};

export default init;