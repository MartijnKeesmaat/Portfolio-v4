(function () {
  window.CanvasSlideshow = function (options) {
    //  SCOPE
    /// ---------------------------
    var that = this;


    const SLIDER_WIDTH = document.querySelector('.slider-detail').offsetWidth;
    const SLIDER_HEIGHT = document.querySelector('.slider-detail').offsetHeight;
    //  OPTIONS
    /// ---------------------------
    options = options || {};
    options.stageWidth = options.hasOwnProperty('stageWidth') ?
      options.stageWidth :
      SLIDER_WIDTH;
    options.stageHeight = options.hasOwnProperty('stageHeight') ?
      options.stageHeight :
      SLIDER_HEIGHT;
    options.pixiSprites = options.hasOwnProperty('sprites') ?
      options.sprites : [];
    options.centerSprites = options.hasOwnProperty('centerSprites') ?
      options.centerSprites :
      false;
    options.displaceScale = options.hasOwnProperty('displaceScale') ?
      options.displaceScale : [200, 70];
    options.displacementImage = options.hasOwnProperty('displacementImage') ?
      options.displacementImage :
      '';
    options.displaceAutoFit = options.hasOwnProperty('displaceAutoFit') ?
      options.displaceAutoFit :
      false;
    options.displaceScaleTo = options.autoPlay === false ? [0, 0] : [20, 20];
    options.displacementCenter = options.hasOwnProperty('displacementCenter') ?
      options.displacementCenter :
      false;

    //  PIXI VARIABLES
    /// ---------------------------
    var renderer = new PIXI.autoDetectRenderer(
      options.stageWidth,
      options.stageHeight, {
        transparent: true
      }
    );
    var stage = new PIXI.Container();
    var slidesContainer = new PIXI.Container();
    var displacementSprite = new PIXI.Sprite.fromImage(
      options.displacementImage
    );
    var displacementFilter = new PIXI.filters.DisplacementFilter(
      displacementSprite
    );

    /// ---------------------------
    //  INITIALISE PIXI
    /// ---------------------------
    this.initPixi = function () {
      // Add canvas to the HTML
      document.querySelector('.slide-item').appendChild(renderer.view);

      // Add child container to the main container
      stage.addChild(slidesContainer);

      // Enable Interactions
      stage.interactive = true;

      renderer.view.style.maxWidth = '100%';
      renderer.view.style.objectFit = 'cover';
      renderer.view.style.width = '100%';
      renderer.view.style.height = '100%';

      displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      // Set the filter to stage and set some default values for the animation
      stage.filters = [displacementFilter];

      displacementSprite.scale.x = 2;
      displacementSprite.scale.y = 2;

      // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
      displacementFilter.autoFit = options.displaceAutoFit;

      stage.addChild(displacementSprite);
    };

    /// ---------------------------
    //  LOAD SLIDES TO CANVAS
    /// ---------------------------
    this.loadPixiSprites = function (sprites) {
      var rSprites = options.sprites;

      for (var i = 0; i < rSprites.length; i++) {
        var texture = new PIXI.Texture.fromImage(sprites[i]);
        var image = new PIXI.Sprite(texture);

        if (options.centerSprites === true) {
          image.anchor.set(0.5);
          image.x = renderer.width / 2;
          image.y = renderer.height / 2;
        }

        slidesContainer.addChild(image);
      }
    };

    /// ---------------------------
    //  DEFAULT RENDER/ANIMATION
    /// ---------------------------
    var ticker = new PIXI.ticker.Ticker();

    ticker.autoStart = options.autoPlay;

    ticker.add(function (delta) {
      displacementSprite.x += options.autoPlaySpeed[0] * delta;
      displacementSprite.y += options.autoPlaySpeed[1];

      renderer.render(stage);
    });

    /// ---------------------------
    //  INIT FUNCTIONS
    /// ---------------------------

    this.init = function () {
      that.initPixi();
      that.loadPixiSprites(options.pixiSprites);
    };

    /// ---------------------------
    //  START
    /// ---------------------------
    this.init();

    /// ---------------------------
    //  HELPER FUNCTIONS
    /// ---------------------------
    function scaleToWindow(canvas, backgroundColor) {
      var scaleX, scaleY, scale, center;

      //1. Scale the canvas to the correct size
      //Figure out the scale amount on each axis
      scaleX = window.innerWidth / canvas.offsetWidth;
      scaleY = window.innerHeight / canvas.offsetHeight;

      //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
      scale = Math.min(scaleX, scaleY);
      canvas.style.transformOrigin = '0 0';
      canvas.style.transform = 'scale(' + scale + ')';

      //2. Center the canvas.
      //Decide whether to center the canvas vertically or horizontally.
      //Wide canvases should be centered vertically, and
      //square or tall canvases should be centered horizontally
      if (canvas.offsetWidth > canvas.offsetHeight) {
        if (canvas.offsetWidth * scale < window.innerWidth) {
          center = 'horizontally';
        } else {
          center = 'vertically';
        }
      } else {
        if (canvas.offsetHeight * scale < window.innerHeight) {
          center = 'vertically';
        } else {
          center = 'horizontally';
        }
      }

      //Center horizontally (for square or tall canvases)
      var margin;
      if (center === 'horizontally') {
        margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
        canvas.style.marginTop = 0 + 'px';
        canvas.style.marginBottom = 0 + 'px';
        canvas.style.marginLeft = margin + 'px';
        canvas.style.marginRight = margin + 'px';
      }

      //Center vertically (for wide canvases)
      if (center === 'vertically') {
        margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
        canvas.style.marginTop = margin + 'px';
        canvas.style.marginBottom = margin + 'px';
        canvas.style.marginLeft = 0 + 'px';
        canvas.style.marginRight = 0 + 'px';
      }

      //3. Remove any padding from the canvas  and body and set the canvas
      //display style to "block"
      canvas.style.paddingLeft = 0 + 'px';
      canvas.style.paddingRight = 0 + 'px';
      canvas.style.paddingTop = 0 + 'px';
      canvas.style.paddingBottom = 0 + 'px';
      canvas.style.display = 'block';

      //4. Set the color of the HTML body background
      document.body.style.backgroundColor = backgroundColor;

      //Fix some quirkiness in scaling for Safari
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
          // Chrome
        } else {
          // Safari
          //canvas.style.maxHeight = "100%";
          //canvas.style.minHeight = "100%";
        }
      }

      //5. Return the `scale` value. This is important, because you'll nee this value
      //for correct hit testing between the pointer and sprites
      return scale;
    } // http://bit.ly/2y1Yk2k
  };
})();