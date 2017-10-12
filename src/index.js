import debounce from '../node_modules/lodash.debounce/index';
import throttle from '../node_modules/lodash.throttle/index';

$(document).ready(() => {
  AOS.init({
    disable: 'mobile',
    easing: 'ease-in-out',
    delay: 100,
    duration: 1000,
    offset: 100,
    once: true
  });
  scrollBtnInit();
  dropDownInit();
  toggleCollapse();
  initProjectSlider();
  initMenuBtn();
  initToolsBtns();
  initScrollBtns();
  setModelsHeight();
  selectModel();
  $(window).resize(debounce(setModelsHeight, 150));
});

function scrollBtnInit() {
  $('.footer__up-btn').click(function (event) {
    var target = $(this.hash);
    if (target.length) {
      event.preventDefault();

      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function () {

        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) {
          return false;
        } else {
          $target.attr('tabindex', '-1');
          $target.focus();
        };
      });
    }
  });
}

function dropDownInit() {
  $('.breadcrumbs__dd-btn').click((event) => {
    const hasClass = $(event.target.parentElement).hasClass('breadcrumbs__dd-btn-show');
    const elementsCount = $('.breadcrumbs__dd-btn-show').length;
    if (hasClass && elementsCount) {
      $(event.target.parentElement).removeClass('breadcrumbs__dd-btn-show');
    } else if (!hasClass && elementsCount) {
      $('.breadcrumbs__dd-btn-show').removeClass('breadcrumbs__dd-btn-show');
      $(event.target.parentElement).addClass('breadcrumbs__dd-btn-show');
    } else {
      $(event.target.parentElement).addClass('breadcrumbs__dd-btn-show');
    }
  });

  $(window).click((event) => {
    if (!$(event.target).is('.breadcrumbs__dd-btn')) {
      $('.breadcrumbs__dd-btn-show').removeClass('breadcrumbs__dd-btn-show');
    }
  })
}

function toggleCollapse() {
  let timeout;
  $('.desc__title-collapse-btn').click((event) => {
    $('.desc__mobile-title').toggleClass('active');
    const panel = $('.desc__collapse-container')[0];
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      timeout = setTimeout(() => {
        panel.style.display = 'none';
      }, 600);
    } else {
      clearTimeout(timeout);
      panel.style.display = 'block';
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  })
}

function initProjectSlider() {
  const projects = $('.projects__slider');
  projects.length && projects.slick({
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: `<button type="button" class="slick-prev">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" aria-label="Slider prev button icon">
                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>
                  </svg>
                </button>`,
    nextArrow: `<button type="button" class="slick-next">
                  <svg width="24px" height="24px" viewBox="0 0 24 24" aria-label="Slider next button icon">
                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>
                  </svg>
                </button>`,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 5,
        },
      }
    ]
  });
}

function initModelsSlider() {
  const models = $('.models');
  if (!models.length) return;
  const slider = models.slick({
    infinite: false,
    slidesToShow: calcModelsSlides(),
    slidesToScroll: 1,
    vertical: true,
    prevArrow: `<button type="button" class="slick-prev">
                  <svg viewBox="0 0 24 24" aria-label="Slider prev button icon">
                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>
                  </svg>
                </button>`,
    nextArrow: `<button type="button" class="slick-next">
                  <svg viewBox="0 0 24 24" aria-label="Slider next button icon">
                    <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>
                  </svg>
                </button>`,
  });

  $(window).resize(debounce(() => {
    slider.slick('slickSetOption', 'slidesToShow', calcModelsSlides(), true);
  }, 150));
}
function calcModelsSlides() {
  const headerHeight = 80;
  const sliderBtns = 68;
  const topPadding = 10;
  const slideHeight = window.innerWidth < 1600 ? 100 : 150;

  const sliderHeight = headerHeight + sliderBtns + topPadding;
  return Math.floor((window.innerHeight - headerHeight - sliderBtns - topPadding) / slideHeight);
}

function initToolsBtns() {
  let slider;
  const fullscreen = $('.fullscreen')
  $('.model-3d__fullscreen-btn').click(() => {
    fullscreen.css('display', 'flex')
    setTimeout(() => { 
      fullscreen.css('opacity', 1);
    }, 0);
    $('.gallery-container').css('display', 'none');

    slider = $('.fullscreen__slider').slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: true,
      prevArrow: `<button type="button" class="slick-prev">
                    <svg viewBox="0 0 24 24" aria-label="Slider prev button icon">
                      <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>
                    </svg>
                  </button>`,
      nextArrow: `<button type="button" class="slick-next">
                    <svg viewBox="0 0 24 24" aria-label="Slider next button icon">
                      <polygon fill="#757575" points="10 6 8.59 7.41 13.17 12 8.59 16.59 10 18 16 12"></polygon>
                    </svg>
                  </button>`
    });
  });
  $('.fullscreen__close-btn').click(() => {
    fullscreen.css('opacity', 0)
    $('.gallery-container').css('display', 'flex');
    
    setTimeout(() => {
      fullscreen.css('display', 'none');
      slider.slick('unslick');
    }, 300);
  });
}
function initMenuBtn() {
  const menu = $('.mobile-menu');
  let wasFullscreen = false;
  $('.header__menu-btn').click(() => {
    menu.css('display', 'flex')
    setTimeout(() => { 
      menu.css('opacity', 1);
    }, 0);
    $('.gallery-container').css('display', 'none');
    $('.header').css('display', 'none');

    if ($('.fullscreen').css('display') === 'flex') {
      wasFullscreen = true;
      $('.fullscreen').css('display', 'none');
    } else {
      wasFullscreen = false;
    }
  });

  $('.mobile-menu__close-btn').click(() => {
    menu.css('opacity', 0);
    $('.header').css('display', 'block');
    $('.gallery-container').css('display', 'flex');

    if (wasFullscreen) {
      $('.fullscreen').css('display', 'flex');
    }
    
    setTimeout(() => {
      menu.css('display', 'none');
    }, 300);
  });
}

function initScrollBtns() {
  $('.models__container').scroll(debounce((event) => {
    event.stopPropagation
    const container = $(event.target);
    const itemHeight = window.innerWidth < 1600 ? 100 : 160;
    const top =  container.scrollTop();
    const extra = top % itemHeight;
    if (extra) {
      container.animate({
        scrollTop: extra < itemHeight / 2 ? top - extra : top + itemHeight - extra
      }, 300);
    }
  }, 100));

  $('.models__scroll-down').click(() => {
    const container = $('.models__container');
    const itemHeight = window.innerWidth < 1600 ? 100 : 160;
    const top = container.scrollTop();
    container.animate({
      scrollTop: top - (top % itemHeight) + itemHeight
    }, 300);
  });
  $('.models__scroll-up').click(() => {
    const itemHeight = window.innerWidth < 1600 ? 100 : 160;
    const container = $('.models__container');
    const top = container.scrollTop();
    container.animate({
      scrollTop: top - (top % itemHeight || itemHeight)
    }, 300);
  });
}

function setModelsHeight() {
  const itemHeight = window.innerWidth < 1600 ? 100 : 160;
  const modelsHeight = window.innerHeight - 186;
  $('.models__container').height(modelsHeight - (modelsHeight % itemHeight));
}

function selectModel() {
  $('.models__model').click((event) => {
    console.log(111);
    $('.models__model').removeClass('isSelected');
    $(event.currentTarget ).addClass('isSelected');
  });
}