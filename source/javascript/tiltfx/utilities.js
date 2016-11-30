export function getMousePos (e) {
  var posx = 0;
  var posy = 0;
  if (!e) e = window.event;
  if (e.pageX || e.pageY) 	{
    posx = e.pageX;
    posy = e.pageY;
  }
  else if (e.clientX || e.clientY) 	{
    posx = e.clientX + document.body.scrollLeft
    + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop
    + document.documentElement.scrollTop;
  }
  return {
    x : posx,
    y : posy
  };
}

export function throttle (fn, delay) {
  var allowSample = true;

  return function(e) {
    if (allowSample) {
      allowSample = false;
      setTimeout(function() { allowSample = true; }, delay);
      fn(e);
    }
  };
}
