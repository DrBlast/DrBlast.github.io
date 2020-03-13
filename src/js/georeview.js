const balloonTpl = require('../templates/balloon.hbs');

const init = () => {
        const balloonLayout = ymaps.templateLayoutFactory.createClass(
            balloonTpl(), {
                build: function () {
                    this.superclass.build.call(this);
                    const closeButton = document.querySelector('.btn-close');

                    closeButton.addEventListener('click', () => {
                        this.closeBalloon();
                    })
                },
                clear: function () {
                    this.superclass.clear.call(this);
                },
                closeBalloon: function () {
                    this.events.fire('userclose');
                },
                getShape: function () {
                    let el = this.getElement(),
                        result = null;
                    if (el) {
                        let firstChild = el.firstChild;
                        result = new ymaps.shape.Rectangle(
                            new ymaps.geometry.pixel.Rectangle([
                                [0, 0],
                                [firstChild.offsetWidth, firstChild.offsetHeight]
                            ])
                        );
                    }
                    return result;
                }
            });


        const reverseGeoCode = (coords) => {
            // Определяем адрес по координатам (обратное геокодирование).
            return ymaps.geocode(coords).then(res => {
                let firstGeoObject = res.geoObjects.get(0);
                return firstGeoObject.getAddressLine();
            });
        };


        const bcl = (address) => {
            return ymaps.templateLayoutFactory.createClass(balloonTpl(address));
        }


        let map = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controlls: ['zoomControl']

        });

        map.events.add('click', e => {
            const pointCoords = e.get('coords');
            const pointAddress = reverseGeoCode(pointCoords);

            // console.log(pointAddress);
            console.log(pointCoords);
            pointAddress.then(address => {
                map.balloon.open(pointCoords, {
                    properties: {
                        coords: pointCoords,
                        address: address
                    },
                    layout: balloonLayout,
                    contentLayout: bcl(address),
                    closeButton: false
                });
            });
        });
// MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(balloonTpl),
//
//     // Создание метки с пользовательским макетом балуна.
// let myPlacemark = window.myPlacemark = new ymaps.Placemark(map.getCenter(), {
//     balloonHeader: 'Заголовок балуна',
//     hintContent: 'Контент балуна'
// }, {
//
//     balloonShadow: false,
//     balloonLayout: balloonLayout,
//     balloonContentLayout: balloonContentLayout,
//     // balloonPanelMaxMapArea: 0,
//     iconLayout: 'default#image',
//     iconImageHref: './img/balloon.svg',
//     iconImageSize: [20, 30],
//
//     // Не скрываем иконку при открытом балуне.
//     // hideIconOnBalloonOpen: false,
//     // И дополнительно смещаем балун, для открытия над иконкой.
//     // balloonOffset: [3, -40]
// });
//
// map.geoObjects.add(myPlacemark);
    }
;

export default init;