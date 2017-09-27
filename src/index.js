$(document).ready(() => {
  AOS.init({
    disable: 'mobile',
    easing: 'ease-out',
    delay: 100,
    duration: 800,
    offset: 200,
  });  
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


  $('.breadcrumbs__dd-btn').click((event) => {
    // $('.breadcrumbs__dd-list').removeClass('show');
    if ($(event.target.nextElementSibling).hasClass('breadcrumbs__dd-btn-show') && $('.breadcrumbs__dd-btn-show').length) {
      $(event.target.nextElementSibling).removeClass('breadcrumbs__dd-btn-show');
    } else if (!$(event.target.nextElementSibling).hasClass('breadcrumbs__dd-btn-show') && $('.breadcrumbs__dd-btn-show').length) {
      $('.breadcrumbs__dd-list').removeClass('breadcrumbs__dd-btn-show');
      $(event.target.nextElementSibling).addClass('breadcrumbs__dd-btn-show');
    } else {
      $(event.target.nextElementSibling).addClass('breadcrumbs__dd-btn-show');
    }
  });

  $(window).click((event) => {
    if (!event.target.matches('.breadcrumbs__dd-btn')) {
      $('.breadcrumbs__dd-list').removeClass('breadcrumbs__dd-btn-show');
    }
  })
});