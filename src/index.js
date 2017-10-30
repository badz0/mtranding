$(document).ready(function() {
  $('.top-section__scroll-icon').click(function(event) {
    $("html, body").animate({ scrollTop: $('.desc-section').offset().top }, 1000);
  });
  $('.in-addition-section__scroll-icon').click(function(event) {
    $("html, body").animate({ scrollTop: $('.why-section').offset().top }, 1000);
  });
});