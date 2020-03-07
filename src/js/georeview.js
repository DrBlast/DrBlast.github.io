const balloonTpl = require('../templates/b.hbs');

const init = () => {
    //
    // const balloonLayout = ymaps.templateLayoutFactory.createClass(balloonTpl(), {
    //     build: function () {
    //         balloonLayout.superclass.build.call(this);
    //         const closeButton = document.querySelector('.btn-close');
    //
    //         closeButton.addEventListener('click', () => {
    //             this.closeBalloon();
    //         })
    //     },
    //     clear: function () {
    //         balloonLayout.superclass.clear.call(this);
    //     },
    //     closeBalloon: function () {
    //         this.events.fire('userclose');
    //     }
    // });

    const iconLayout = ymaps.templateLayoutFactory.createClass(
        '<i class="fa fa-map-marker-alt map-balloon"></i>',
        {
            build: function () {
                // необходим вызов родительского метода, чтобы добавить содержимое макета в DOM
                this.constructor.superclass.build.call(this);
                const myIcon = document.querySelector(".map-balloon");

                myIcon.addEventListener('mouseover', (e) => {
                    //e.target.style.cursor = "pointer";
                    e.target.style.color = "#ff8663";

                });
            },

            clear: function () {
                const myIcon = document.querySelector(".map-balloon");

                // myBalloon.removeEventListener('mouseover', this.onNameHover);
            },

        }
    );


    let map = new ymaps.Map('map', {
            center: [55.650625, 37.62708],
            zoom: 10,
            controlls: ['zoomControl']

        }),

        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(balloonTpl),

        // Создание метки с пользовательским макетом балуна.
        myPlacemark = window.myPlacemark = new ymaps.Placemark(map.getCenter(), {
            balloonHeader: 'Заголовок балуна',
            hintContent: 'Контент балуна'
        }, {

            balloonShadow: false,
            // balloonLayout: balloonLayout,
            // balloonContentLayout: MyBalloonContentLayout,
           // balloonPanelMaxMapArea: 0,
            iconLayout: iconLayout
            // Не скрываем иконку при открытом балуне.
            // hideIconOnBalloonOpen: false,
            // И дополнительно смещаем балун, для открытия над иконкой.
            // balloonOffset: [3, -40]
        });

    map.geoObjects.add(myPlacemark);
};

export default init;