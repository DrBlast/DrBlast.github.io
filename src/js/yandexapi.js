const init = () => {

    let map = new ymaps.Map('map', {
        center: [55.650625, 37.62708],
        zoom: 10,
        controlls: ['zoomControl']

    }),
        myBalloonContentLayout =

        ymaps.templateLayoutFactory.createClass('<p>$[[options.contentBodyLayout]]</p>');
// Создание макета основного содержимого контента балуна.
    var counter = 0,
        myBalloonContentBodyLayout = ymaps.templateLayoutFactory.createClass(
            '<b>$[properties.name]</b><br /><button id="counter-button">Counter</button> <i id="count"></i>', {
                build: function () {
                    myBalloonContentBodyLayout.superclass.build.call(this);
                    $('#counter-button').bind('click', this.onCounterClick);
                    $('#count').html(counter);
                },
                clear: function () {
                    $('#counter-button').unbind('click', this.onCounterClick);
                    myBalloonContentBodyLayout.superclass.clear.call(this);
                },
                onCounterClick: function () {
                    $('#count').html(++counter);
                }
            }),

// Создание макета для контента метки.
        myIconContentLayout = ymaps.templateLayoutFactory.createClass(
            '<h3 id="layout-element">$[properties.name]</h3>' +
            '[if properties.description]<i>$[properties.description]</i>[else]$[properties.metaDataProperty.description][endif]', {
                build: function () {
                    // необходим вызов родительского метода, чтобы добавить содержимое макета в DOM
                    this.constructor.superclass.build.call(this);
                    $('#layout-element').bind('mouseover', this.onNameHover);
                },

                clear: function () {
                    $('#layout-element').unbind('mouseover', this.onNameHover);
                    this.constructor.superclass.clear.call(this);
                },

                onNameHover: function () {
                    $('#layout-element').css('color', getRandomColor());
                }
            });

    var getRandomColor = function () {
        return 'rgb(' +
            [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(',') +
            ')';
    };

    var myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: [55.650625, 37.62708]
        },
        properties: {
            name: 'my name',
            metaDataProperty: {
                description: 'metaData description'
            }
        }
    }, {
        balloonContentBodyLayout: myBalloonContentBodyLayout,
        balloonContentLayout: myBalloonContentLayout,
        iconContentLayout: myIconContentLayout,
        // Выставляем тянущийся макет иконки, чтобы вместился вложенный макет myIconContentLayout.
        preset: 'twirl#nightStretchyIcon'
    });

    map.geoObjects.add(myGeoObject);
// Установим через 5 секунд свойство в геообъекте. Макет контента иконки отследит это обновление и обновит содержимое.
    setTimeout(function () {
        myGeoObject.properties.set('description', 'my description after timeout');
    }, 5000);

// Пример 2. Открытие балуна на карте с заданными макетами.
    map.balloon.open(map.getCenter(), {
        myBodyContent: '<b>body content</b>',
        myFooterContent: 'footer content'
    }, {
        contentBodyLayout: ymaps.templateLayoutFactory.createClass('<p>$[myBodyContent]</p>'),
        contentFooterLayout: ymaps.templateLayoutFactory.createClass('<i>$[myFooterContent]</i>')
    });

}

