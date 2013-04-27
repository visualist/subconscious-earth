
$(document).ready(function() {
  var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight|| e.clientHeight|| g.clientHeight;

  window.viewport = {
      width: x, height: y
  };
  console.log("Viewport: w=" + viewport.width + ", h=" + viewport.height);
});


/*
 * Exploring the various ways of rendering the images:
 *  - series of img tags
 *  - series of canvas tags
 *  - single canvas, add all photos to it
 */



// moving within ImagesView
var xoncex = 1;

// moving within ImagesView
function xrender_to_1canvasx(im, hscale, alpha) {
  var canvas;
  if (once-- > 0) {
    canvas = document.createElement('canvas');
    canvas.id = 'c1';
    var canvases = document.getElementById("canvases");
    canvases.appendChild(canvas);
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
  } else {
    canvas = document.getElementById("c1");
  }
  var ctx = canvas.getContext('2d');
  // alpha (0-1): conversion from opacity (0-100 percent)
  ctx.globalAlpha = alpha;
  // horizontal scaling
  ctx.scale(hscale, 1.0);
  ctx.drawImage(im,0,0, viewport.width, viewport.height);
}

// moving within ImagesView
function xrender_canvasx(img, hstretch, opacity) {
  $('#hidden-images').append(img);
  var alpha = (opacity / 100.0);
  render_to_1canvas(img, hstretch, alpha);
}




var ImagesView = Backbone.View.extend({

  initialize: function(options) {
    this.collection.on("add", this.onAdd, this);
    this.collection.on("remove", this.onRemove, this);
    this.collection.on("update", this.onUpdate, this);
    this.__whoami = 'ImagesView'; //debugging
    this.once = 1;
  },

  render_to_1canvas: function(im, hscale, alpha) {
    var self = this;
    var canvas;

    // TODO: refactor this logic into initialize
    if (self.once-- > 0) {
      canvas = document.createElement('canvas');
      canvas.id = 'c1';
      var canvases = document.getElementById("canvases");
      canvases.appendChild(canvas);
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
    } else {
      canvas = document.getElementById("c1");
    }
    var ctx = canvas.getContext('2d');
    // alpha (0-1): conversion from opacity (0-100 percent)
    ctx.globalAlpha = alpha;
    // horizontal scaling
    ctx.scale(hscale, 1.0);
    ctx.drawImage(im,0,0, viewport.width, viewport.height);
  },

  render_canvas: function(img, hstretch, opacity) {
    var self = this;
    $('#hidden-images').append(img);
    var alpha = (opacity / 100.0);
    self.render_to_1canvas(img, hstretch, alpha);
  },

  onAdd: function(img_model) {
    var self = this;
    var vp_width = viewport.width;
    var url = img_model.get('proxy_url');
    var iid = img_model.get('image_id'); // flickr image id
    var eid = img_model.get('eqid');
    var depth = img_model.get('depth');
    var mag = img_model.get('mag');
    console.log("add-image: iid=" +iid +" for " +img_model.get('eqid') +": " + depth);

    /*
     * Apply effects to the image
     */

    // depth translates to blur, from 0-800 range to 0.0-3.0
    var blur_by_depth = (depth / 200.0);

    // mag(nitude) translates to opacity & horizontal-stretch
    //   ranges:: mag: 0-10, opacity: 10-90 percent, hstretch: 1.0-3.0
    //var opacity_by_mag = (parseFloat(img_model.get('mag')) / 12.0);
    var opacity_by_mag = Math.floor(8.0 * mag + 10.0); // percent: 10-90 range
    var hstretch_by_mag = (mag / 5.0) + 1.0;

    var img = new Image();
    img.onload = function(ev, alt) {
      var img_elem = ev.srcElement; // still need this here?
      Pixastic.process(img, "blurfast", {amount: blur_by_depth});
      self.render_canvas(img_elem, hstretch_by_mag, opacity_by_mag);
    }
    // w/jquery set img element's attributes before it is loaded
    var jq_img = $(img);
    jq_img.attr({id: eid});
    if (vp_width > 50) {
      jq_img.attr({width: vp_width});
    }
    jq_img.css({opacity: opacity_by_mag});
    img.src = url;
    console.log(" *onAdd-image(queued): " + eid);
  },

  onRemove: function(img_model) {
    var eid = img_model.get('eqid');
    console.log(" *onRemove-image: " + eid);
    $('#' + eid).remove();
  },

  onUpdate: function(img_model)  {
    var eid = img_model.get('eqid');
    console.log(" *onUpdate-image: " + eid);
  },

});

