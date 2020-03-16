const balloonTpl = require('../templates/balloon.hbs');
const reviewsTpl = require('../templates/reviews.hbs');

const init = () => {

    const getCoords = (point) => {
        return point.coords ? point.coords : point.geometry.getCoordinates();
    };

    const balloonLayout = ymaps.templateLayoutFactory.createClass(
        '$[[options.contentLayout]]', {
            build: function () {
                balloonLayout.superclass.build.call(this);
                const closeButton = document.querySelector('.btn-close');

                closeButton.addEventListener('click', () => {
                    this.closeBalloon();
                });

                const addReviewBtn = document.querySelector('.add-review-btn');

                addReviewBtn.addEventListener('click', e => {
                    e.preventDefault();
                    let geoObject = map.balloon.getData();
                    let reviewList = document.querySelector(".review-list");
                    let reviewForm = addReviewBtn.closest('form.add-review');
                    let reviewDetails = getReviewDetails(reviewForm);
                    let placeWithReview = {
                        coords: getCoords(geoObject),
                        addr: geoObject.addr,
                        review: reviewDetails
                    };

                    addOrUpdateLocalStorageItem(placeWithReview);
                    updateReviewList(reviewList, geoObject.addr);
                    createPlacemark(placeWithReview);

                  //  map.balloon.close();
                })
            },
            clear: function () {
                balloonLayout.superclass.clear.call(this);
            },
            closeBalloon: function () {
                this.events.fire('userclose');
            },
            getShape: function () {
                let el = document.querySelector('.review-popup'),
                    result = null;
                if (el) {
                    result = new ymaps.shape.Rectangle(
                        new ymaps.geometry.pixel.Rectangle([
                            [0, 0],
                            [el.offsetWidth, el.offsetHeight]
                        ])
                    );
                }
                return result;
            }
        });

    const getReviewDetails = (reviewForm) => {
        return {
            author: reviewForm['author'].value,
            place: reviewForm['place'].value,
            reviewText: reviewForm['review-text'].value,
            date: new Date().toLocaleDateString()
        };
    };

    const getReviews = (address) => {
        let currentAddressReviewsStr = localStorage.getItem(address);
        return JSON.parse(currentAddressReviewsStr);
    };

    const addOrUpdateLocalStorageItem = (placeReview) => {
        if (!localStorage.getItem(placeReview.addr)) {
            let reviews = [];

            reviews.push(placeReview);
            localStorage.setItem(placeReview.addr, JSON.stringify(reviews));
        } else {
            let currentAddressReviews = getReviews(placeReview.addr);

            currentAddressReviews.push(placeReview);
            localStorage.setItem(placeReview.addr, JSON.stringify(currentAddressReviews));
        }
    };

    const updateReviewList = (reviewElement, address) => {
        let reviews = getReviews(address);
        console.log(reviews);
        let reviewHtml = reviewsTpl({reviews});
        console.log(reviewHtml);
        reviewElement.innerHTML = reviewHtml;
    };

    const reverseGeoCode = (coords) => {
        // Определяем адрес по координатам (обратное геокодирование).
        return ymaps.geocode(coords).then(res => {
            let firstGeoObject = res.geoObjects.get(0);
            return firstGeoObject.getAddressLine();
        });
    };

    const bcl = (address) => {
        let balloonHTML = balloonTpl(address);
        return ymaps.templateLayoutFactory.createClass(balloonHTML);
    };

    let map = new ymaps.Map('map', {
        center: [55.650625, 37.62708],
        zoom: 10,
        controlls: ['zoomControl']

    }, {balloonLayout});

    const openBalloon = (geoObj) => {
        map.balloon.open(geoObj.coords, geoObj, {
            layout: balloonLayout,
            contentLayout: bcl(geoObj)
        });
    };

    map.events.add('click', e => {
        const pointCoords = e.get('coords');
        const pointAddress = reverseGeoCode(pointCoords);

        pointAddress.then(address => {
            let geoObj = {
                coords: pointCoords,
                addr: address
            };
            openBalloon(geoObj);
        });
    });

    const createPlacemark = (placemarkData) => {
        let myPlacemark = new ymaps.Placemark(placemarkData.coords, {
            geoObj: placemarkData
        }, {
            balloonShadow: false,
            balloonLayout: balloonLayout,
            balloonContentLayout: bcl(placemarkData),
            iconLayout: 'default#image',
            iconImageHref: './img/balloon.svg',
            iconImageSize: [20, 30],
        });

        map.geoObjects.add(myPlacemark);

        return myPlacemark;
    };
};

export default init;