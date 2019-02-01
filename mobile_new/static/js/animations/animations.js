var VerticalSwiper, HorizontalSwiper;
$(document).ready(function () {
    VerticalSwiper = new Swiper('.swiper-container-vertical', {
        direction: 'vertical',
        loop: false,
        initialSlide: 1,
        fadeEffect: {
            crossFade: true,
        },
        observer: true,
        pagination: {
            el: '.swiper-pagination',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    HorizontalSwiper_Main = new Swiper('.swiper-container-horizontal.main', {
        direction: 'horizontal',
        loop: false,
        initialSlide: 0,
        fadeEffect: {
            crossFade: true,
        },
        observer: true,
        navigation: {
            nextEl: '.layui-icon-right',
            prevEl: '.layui-icon-left',
        }
    });

    HorizontalSwiper_Help = new Swiper('.swiper-container-horizontal.help', {
        direction: 'horizontal',
        loop: false,
        initialSlide: 0,
        fadeEffect: {
            crossFade: true,
        },
        observer: true,
        navigation: {
            nextEl: '.layui-icon-right',
            prevEl: '.layui-icon-left',
        }
    });
});