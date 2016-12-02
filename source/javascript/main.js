import $ from 'jquery';
import TiltFX from './tiltfx/index';
import vidbg from './vidbg/index';

$(document).ready(() => {
  new TiltFX(document.querySelector('.intro__tilt__image'), {
    'opacity' : 0.7,
    'movement': {
      'perspective' : 1000,
      'translateX' : 70,
      'translateY' : 10,
      'translateZ' : 2,
      'rotateX' : 3,
      'rotateY' : 3
    }
  });

  // Add menu.
  const $nav = $('.nav');
  const $main = $('.main');

  $('.mopen').on('click', (e) => {
    e.preventDefault();

    $nav.toggleClass('nav--active');
    $main.toggleClass('main__blur');
  });

  $nav.find('a').on('click', () => {
    $nav.removeClass('nav--active');
    $main.removeClass('main__blur');
  });
});
