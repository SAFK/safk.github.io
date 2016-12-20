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
/*
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







*/

	//variables
  var hijacking = 'off',
    animationType = 'fixed',
    delta = 0,
    scrollThreshold = 5,
    actual = 1,
    animating = false;

  //DOM elements
  var sectionsAvailable = $('.cd-section'),
    verticalNav = $('.cd-vertical-nav'),
    prevArrow = verticalNav.find('a.cd-prev'),
    nextArrow = verticalNav.find('a.cd-next');

	
	//check the media query and bind corresponding events
    var MQ = 'desktop',
      bindToggle = false;


    bindEvents(MQ, true);

    $(window).on('resize', function () {
      MQ = deviceType();
      bindEvents(MQ, bindToggle);
      if (MQ == 'mobile') bindToggle = true;
      if (MQ == 'desktop') bindToggle = false;
    });

    function bindEvents(MQ, bool) {

      if (MQ == 'desktop' && bool) {
        scrollAnimation();
        $(window).on('scroll', scrollAnimation);
        prevArrow.on('click', prevSection);
        nextArrow.on('click', nextSection);

        $(document).on('keydown', function (event) {
          if (event.which == '40' && !nextArrow.hasClass('inactive')) {
            event.preventDefault();
            nextSection();
          } else if (event.which == '38' && (!prevArrow.hasClass('inactive') || (prevArrow.hasClass('inactive') && $(window).scrollTop() != sectionsAvailable.eq(0).offset().top))) {
            event.preventDefault();
            prevSection();
          }
        });
      } else if (MQ == 'mobile') {
        //reset and unbind
        resetSectionStyle();
        $(window).off('DOMMouseScroll mousewheel', scrollHijacking);
        $(window).off('scroll', scrollAnimation);
        prevArrow.off('click', prevSection);
        nextArrow.off('click', nextSection);
        $(document).off('keydown');
      }
    }

    function scrollAnimation() {
      //normal scroll - use requestAnimationFrame (if defined) to optimize performance
      (!window.requestAnimationFrame) ? animateSection() : window.requestAnimationFrame(animateSection);
    }

    function animateSection() {
      var scrollTop = $(window).scrollTop(),
        windowHeight = $(window).height(),
        windowWidth = $(window).width();

      sectionsAvailable.each(function () {
        var actualBlock = $(this),
          offset = scrollTop - actualBlock.offset().top;

        //according to animation type and window scroll, define animation parameters
        var animationValues = setSectionAnimation(offset, windowHeight, animationType);

        transformSection(actualBlock.children('div'), animationValues[0], animationValues[1], animationValues[2], animationValues[3], animationValues[4]);
        (offset >= 0 && offset < windowHeight) ? actualBlock.addClass('visible') : actualBlock.removeClass('visible');
      });
    }

    function transformSection(element, translateY, scaleValue, rotateXValue, opacityValue, boxShadow) {
      element = element.get(0);

      element.style.transform = 'translateY(' + translateY + 'vh)';
      element.style.opacity = opacityValue;
    }

    function scrollHijacking(event) {
      // on mouse scroll - check if animate section
      if (event.originalEvent.detail < 0 || event.originalEvent.wheelDelta > 0) {
        delta--;
        (Math.abs(delta) >= scrollThreshold) && prevSection();
      } else {
        delta++;
        (delta >= scrollThreshold) && nextSection();
      }
      return false;
    }

    function prevSection(event) {
      //go to previous section
      typeof event !== 'undefined' && event.preventDefault();

      var visibleSection = sectionsAvailable.filter('.visible'),
        middleScroll = (hijacking == 'off' && $(window).scrollTop() != visibleSection.offset().top) ? true : false;
      visibleSection = middleScroll ? visibleSection.next('.cd-section') : visibleSection;

      var animationParams = selectAnimation(animationType, middleScroll, 'prev');
      unbindScroll(visibleSection.prev('.cd-section'), animationParams[3]);

      if (!animating && !visibleSection.is(":first-child")) {
        animating = true;
        visibleSection.removeClass('visible').children('div').velocity(animationParams[2], animationParams[3], animationParams[4])
          .end().prev('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function () {
            animating = false;
            if (hijacking == 'off') $(window).on('scroll', scrollAnimation);
          });

        actual = actual - 1;
      }

      resetScroll();
    }

    function nextSection(event) {
      //go to next section
      typeof event !== 'undefined' && event.preventDefault();

      var visibleSection = sectionsAvailable.filter('.visible'),
        middleScroll = (hijacking == 'off' && $(window).scrollTop() != visibleSection.offset().top) ? true : false;

      var animationParams = selectAnimation(animationType, middleScroll, 'next');
      unbindScroll(visibleSection.next('.cd-section'), animationParams[3]);

      if (!animating && !visibleSection.is(":last-of-type")) {
        animating = true;
        visibleSection.removeClass('visible').children('div').velocity(animationParams[1], animationParams[3], animationParams[4])
          .end().next('.cd-section').addClass('visible').children('div').velocity(animationParams[0], animationParams[3], animationParams[4], function () {
            animating = false;
            if (hijacking == 'off') $(window).on('scroll', scrollAnimation);
          });

        actual = actual + 1;
      }
      resetScroll();
    }

    function unbindScroll(section, time) {
      //if clicking on navigation - unbind scroll and animate using custom velocity animation
      if (hijacking == 'off') {
        $(window).off('scroll', scrollAnimation);
        (animationType == 'catch') ? $('body, html').scrollTop(section.offset().top) : section.velocity("scroll", { duration: time });
      }
    }

    function resetScroll() {
      delta = 0;
    }

    function selectAnimation() {
      // select section animation - scrollhijacking
      var animationVisible = 'translateNone',
        animationTop = 'translateNone',
        animationBottom = 'translateDown',
        easing = 'easeInCubic',
        animDuration = 800;

      return [animationVisible, animationTop, animationBottom, animDuration, easing];
    }

  function setSectionAnimation(sectionOffset, windowHeight) {
    // select section animation - normal scroll
    const scale = 1;
    let translateY = 100;
    const rotateX = '0deg';
    const opacity = 1;
    const  boxShadowBlur = 0;

    if (sectionOffset >= -windowHeight && sectionOffset <= 0) {
      // section entering the viewport
      translateY = (-sectionOffset) * 100 / windowHeight;
    } else if (sectionOffset > 0 && sectionOffset <= windowHeight) {
      //section leaving the viewport - still has the '.visible' class
      translateY = 0;
    } else if (sectionOffset < -windowHeight) {
      //section not yet visible
      translateY = 100;
    } else {
      //section not visible anymore
      translateY = 0;
    }

    return [translateY, scale, rotateX, opacity, boxShadowBlur];
  }
});

