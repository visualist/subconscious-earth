
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

var ImagesView = Backbone.View.extend({

  initialize: function(options) {
    this.__whoami = 'ImagesView'; //debugging
    this.collection.on("add", this.onAdd, this);
    this.collection.on("remove", this.onRemove, this);
    this.collection.on("update", this.onUpdate, this);
    this.el = $("canvas#c1"); // ?
    var canvas = document.getElementById("c1"); // not really the backbone idiom
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
  },

  render_to_1canvas: function(im, hscale, alpha) {
    var self = this;
    var canvas = document.getElementById("c1"); // not really the backbone idiom
    var ctx = canvas.getContext('2d');
    // alpha (0-1): conversion from opacity (0-100 percent)
    ctx.globalAlpha = alpha;
    // horizontal scaling
    ctx.scale(hscale, 1.0);
    ctx.drawImage(im,0,0, viewport.width, viewport.height);
  },

  render_canvas: function(img, hstretch, opacity) {
    var self = this;

    var alpha = (opacity / 100.0);
    self.render_to_1canvas(img, hstretch, alpha);
  },

  render_image: function(img_element, img_model) {
    var self = this;
    var depth = img_model.get('depth');
    var mag = img_model.get('mag');
    // depth translates to blur, from 0-800 range to 0.0-3.0
    var blur_by_depth = (depth / 200.0);
    // mag(nitude) translates to opacity & horizontal-stretch
    //   ranges:: mag: 0-10, opacity: 10-90 percent, hstretch: 1.0-3.0
    //var opacity_by_mag = (parseFloat(img_model.get('mag')) / 12.0);
    var opacity_by_mag = Math.floor(8.0 * mag + 10.0); // percent: 10-90 range
    var hstretch_by_mag = (mag / 5.0) + 1.0;

    // image size/width & opacity
    var jq_img = $(img_element);
    var vp_width = viewport.width;
    if (vp_width > 50) {
      jq_img.attr({width: vp_width});
    }
    jq_img.css({opacity: opacity_by_mag});

    Pixastic.process(img_element, "blurfast", {amount: blur_by_depth});

    self.render_canvas(img_element, hstretch_by_mag, opacity_by_mag);
  },


  // event is tied to this method:
  onAdd: function(img_model) {
    var self = this;
    var vp_width = viewport.width;
    var url = img_model.get('proxy_url');
    var iid = img_model.get('image_id'); // flickr image id
    var eid = img_model.get('eqid');
    console.log("onAdd(image) iid=" + iid + " for " + eid);

    var img = new Image();
    img.onload = function(ev) {
      var img_elem = ev.srcElement;
      $('#hidden-images').append(img_elem); // storage place for images
      self.render_image(img_elem, img_model);
    }
    img.id = eid;
    img.src = url;
    console.log("  *onAdd-image(queued): " + eid);
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

