var VerticalSwiper, HorizontalSwiper;
$(document).ready(function () {

    function work() {
        VerticalSwiper = new Swiper('.swiper-container-vertical', {
            parallax : true,
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
            parallax : true,
            direction: 'horizontal',
            loop: false,
            initialSlide: 0,
            parallax : true,
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
            parallax : true,
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

    }

    setTimeout(work, 128);
    setTimeout(updateSwiper, 400);
    setTimeout(updateSwiper, 800);
    setTimeout(updateSwiper, 1200);
    setTimeout(updateSwiper, 1600);
    setTimeout(updateSwiper, 2000);

});


