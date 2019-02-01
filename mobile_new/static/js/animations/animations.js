$(document).ready(function () {
    var mySwiperVert = new Swiper('.swiper-container-vertical', {
        direction: 'vertical',
        loop: false,
        initialSlide: 1,
        fadeEffect: {
            crossFade: true,
        },
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    var mySwiperHor = new Swiper('.swiper-container-horizontal', {
        direction: 'horizontal',
        loop: false,
        initialSlide: 0,
        fadeEffect: {
            crossFade: true,
        },
        navigation: {
            nextEl: '.layui-icon-right',
            prevEl: '.layui-icon-left',
        }
    });
});