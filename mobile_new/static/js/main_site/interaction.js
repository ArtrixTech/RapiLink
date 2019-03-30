var VerticalSwiper, HorizontalSwiper_Main, HorizontalSwiper_Help;
//$(document).ready(function () {
less.pageLoadFinished.then(
    function () {

        function work() {
            window.VerticalSwiper = new Swiper('#swiper_container_vertical', {
                parallax: false,
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
                },
            });

            window.HorizontalSwiper_Main = new Swiper('#swiper_container_horizontal_main', {
                parallax: false,
                direction: 'horizontal',
                loop: false,
                initialSlide: 0,
                observer: true,
                observerParent: true,
                navigation: {
                    nextEl: '.layui-icon-right',
                    prevEl: '.layui-icon-left',
                },
            });

            window.HorizontalSwiper_Help = new Swiper('#swiper_container_horizontal_help', {
                parallax: false,
                direction: 'horizontal',
                loop: false,
                initialSlide: 0,
                observer: true,
                observerParent: true,
                navigation: {
                    nextEl: '.layui-icon-right',
                    prevEl: '.layui-icon-left',
                },
            });
        }
        setTimeout(work, 10);
    }

);