import { getMousePos, throttle } from './utilities';

class TiltFx {
  el = null;
  options = null;
  imgElems = [];

  constructor (el, options) {
    this.el = el;
    this.options = Object.assign({}, TiltFx.options, options);

    this._init();
    this._initEvents();
  }

  _validateExtraImagesOptions () {
    if (this.options.extraImgs < 1) {
      this.options.extraImgs = 1;
    } else if (this.options.extraImgs > 5) {
      this.options.extraImgs = 5;
    }
  }

  _init () {
    this.tiltWrapper = document.createElement('div');
    this.tiltWrapper.className = 'tilt';

    this.tiltImgBack = document.createElement('div');
    this.tiltImgBack.className = 'tilt__back';
    this.tiltImgBack.style.backgroundImage = `url(${this.el.src})`;
    this.tiltWrapper.appendChild(this.tiltImgBack);

    this._validateExtraImagesOptions();

    if (!this.options.movement.perspective) {
      this.options.movement.perspective = 0;
    }

    for (let i = 0; i < this.options.extraImgs; i++) {
      let el = document.createElement('div');

      el.className = 'tilt__front';
      el.style.backgroundImage = `url(${this.el.src})`;
      el.style.opacity = this.options.opacity;

      this.tiltWrapper.appendChild(el);
      this.imgElems.push(el);
    }

    if (!this.options.bgfixed) {
      this.imgElems.push(this.tiltImgBack);
      this.options.extraImgs++;
    }

    this.el.parentNode.insertBefore(this.tiltWrapper, this.el);
    this.el.parentNode.removeChild(this.el);

    this.view = {
      width : this.tiltWrapper.offsetWidth,
      height : this.tiltWrapper.offsetHeight
    };
  }

  _initEvents () {
    const moveOpts = this.options.movement;

    this.tiltWrapper.addEventListener('mousemove', (ev) => {
      requestAnimationFrame(() => {
        const mousepos = getMousePos(ev);
        const docScrolls = {
          left : document.body.scrollLeft + document.documentElement.scrollLeft,
          top : document.body.scrollTop + document.documentElement.scrollTop
        };
        const bounds = this.tiltWrapper.getBoundingClientRect();
        const relmousepos = {
          x : mousepos.x - bounds.left - docScrolls.left,
          y : mousepos.y - bounds.top - docScrolls.top
        };

        for (let i = 0, len = this.imgElems.length; i < len; i++) {
          var el = this.imgElems[i],
            rotX = moveOpts.rotateX ? 2 * ((i+1)*moveOpts.rotateX/this.options.extraImgs) / this.view.height * relmousepos.y - ((i+1)*moveOpts.rotateX/this.options.extraImgs) : 0,
            rotY = moveOpts.rotateY ? 2 * ((i+1)*moveOpts.rotateY/this.options.extraImgs) / this.view.width * relmousepos.x - ((i+1)*moveOpts.rotateY/this.options.extraImgs) : 0,
            rotZ = moveOpts.rotateZ ? 2 * ((i+1)*moveOpts.rotateZ/this.options.extraImgs) / this.view.width * relmousepos.x - ((i+1)*moveOpts.rotateZ/this.options.extraImgs) : 0,
            transX = moveOpts.translateX ? 2 * ((i+1)*moveOpts.translateX/this.options.extraImgs) / this.view.width * relmousepos.x - ((i+1)*moveOpts.translateX/this.options.extraImgs) : 0,
            transY = moveOpts.translateY ? 2 * ((i+1)*moveOpts.translateY/this.options.extraImgs) / this.view.height * relmousepos.y - ((i+1)*moveOpts.translateY/this.options.extraImgs) : 0,
            transZ = moveOpts.translateZ ? 2 * ((i+1)*moveOpts.translateZ/this.options.extraImgs) / this.view.height * relmousepos.y - ((i+1)*moveOpts.translateZ/this.options.extraImgs) : 0;

          const transformRule = [
            `perspective(${moveOpts.perspective}px)`,
            `translate3d(${transX}px, ${transY}px, ${transZ}px)`,
            `rotate3d(1,0,0, ${rotX}deg)`,
            `rotate3d(0,1,0, ${rotY}deg)`,
            `rotate3d(0,0,1, ${rotZ}deg)`
          ].join('');

          el.style.WebkitTransform = transformRule;
          el.style.transform = transformRule;
        }
      });
    });

    this.tiltWrapper.addEventListener('mouseleave', () => {
      setTimeout(() => {
        for (let i = 0, len = this.imgElems.length; i < len; ++i) {
          let el = this.imgElems[i];
          let elementStyle = el.style;
          let transformRule = `perspective(${moveOpts.perspective}px) translate3d(0,0,0) rotate3d(1,1,1,0deg)`;

          elementStyle.WebkitTransform = transformRule;
          elementStyle.transform = transformRule;
        }
      }, 60);
    });

    window.addEventListener('resize', throttle(() => {
      this.view = {
        width : this.tiltWrapper.offsetWidth,
        height : this.tiltWrapper.offsetHeight
      };
    }, 50));
  }
}

TiltFx.options = {
  // number of extra image elements (div with background-image) to add to the DOM - min:1, max:5 (for a higher number, it's recommended to remove the transitions of .tilt__front in the stylesheet.
  extraImgs : 2,
  // the opacity value for all the image elements.
  opacity : 0.7,
  // by default the first layer does not move.
  bgfixed : true,
  // image element's movement configuration
  movement : {
    perspective : 1000, // perspective value
    translateX : -10, // a relative movement of -10px to 10px on the x-axis (setting a negative value reverses the direction)
    translateY : -10, // a relative movement of -10px to 10px on the y-axis
    translateZ : 20, // a relative movement of -20px to 20px on the z-axis (perspective value must be set). Also, this specific translation is done when the mouse moves vertically.
    rotateX : 2, // a relative rotation of -2deg to 2deg on the x-axis (perspective value must be set)
    rotateY : 2, // a relative rotation of -2deg to 2deg on the y-axis (perspective value must be set)
    rotateZ : 0 // z-axis rotation; by default there's no rotation on the z-axis (perspective value must be set)
  }
};

export default TiltFx;
