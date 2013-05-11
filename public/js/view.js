
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

  $("#canvases").click(function(e){
    //console.log('click');
    //console.log(e);
    var x = e.offsetX;
    var y = e.offsetY;
    console.log("coord: (" + x + ","  + y + ")");
    if (x < 150) {
      $("#c1").pixastic("blur");
    }
  });
});


/*
 * Exploring the various ways of rendering the images:
 *  - series of img tags
 *  - series of canvas tags
 *  - single canvas, add all photos to it
 */

var ImagesView = Backbone.View.extend({

  events: {
    'click': 'logClick',
    'keyup :input': 'logKey',
    'keypress :input': 'logKey'
  },

  logClick: function(e) {
    console.log(e);
  },

  logKey: function(e) {
    console.log(e.type, e.keyCode);
  },

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

  render_canvas: function() {
    var self = this;
    var canvas = document.getElementById("c1"); // not really the backbone idiom
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var images = $('#hidden-images img');
    _.each(images, function( im ) {
      var jqimg = $(im);
      var depth = jqimg.data("depth");
      var mag = jqimg.data("mag");
      var search = jqimg.data("search");

      // depth translates to blur, from 0-800 range to 0.0-3.0
      var blur_by_depth = (depth / 200.0);
      // mag(nitude) translates to opacity & horizontal-stretch
      //   ranges:: mag: 0-10, opacity: 10-90 percent, hstretch: 1.0-3.0
      var opacity_by_mag = Math.floor(8.0 * mag + 10.0); // percent: 10-90 range
      //var hstretch_by_mag = 1.1;
      var hstretch_by_mag = (mag / 5.0) + 1.0;

      var hscale = hstretch_by_mag;
      var alpha = (opacity_by_mag / 100.0);
      if (search === 'secondary') {
        alpha = alpha * 0.50;
      }

      // TODO: FIX: blur is NOT working!
      console.log("Add BLUR to " + jqimg.attr('id') + " by " + blur_by_depth);
      var options = {amount: blur_by_depth};
      jqimg.pixastic("blur", options, function(newImage) { // was blurfast
        console.log('options (from blurfast)..');
        console.log(options);
      });
      //Pixastic.process(im, "blurfast", {amount: blur_by_depth});

      // alpha (0-1): conversion from opacity (0-100 percent)
      ctx.globalAlpha = alpha;
      //ctx.scale(hscale, 1.0); // horizontal scaling : buggy?
      ctx.drawImage(im, 0, 0, viewport.width, viewport.height);
    });
    // adjust overall contrast
    $("#c1").pixastic("brightness", {brightness:0, contrast:2.0});
  },

  render_image: function(img_element, img_model) {
    var search = img_model.get('search');
    $('#hidden-images').append(img_element); // storage place for images

    var depth = img_model.get('depth');
    var mag = img_model.get('mag');

    // set image size/width & opacity & data-attributes
    var jq_img = $(img_element);
    var vp_width = viewport.width;
    if (vp_width > 50) {
      jq_img.attr({width: vp_width});
    }
    jq_img.attr({
      'data-depth': depth,
      'data-mag': mag,
      'data-search': search,
      'data-earth': 'yes', // temporary
    });
    var search_terms = img_model.get('terms');
    if (search_terms) {
      jq_img.attr({ 'data-terms': search_terms });
    }
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
      self.render_image(img_elem, img_model);
      self.render_canvas();
    }
    img.id = eid;
    img.src = url;
    console.log("  *onAdd-image(queued): " + eid);
  },

  onRemove: function(img_model) {
    var self = this;
    if (img_model) {
      var eid = img_model.get('eqid');
      console.log(" *onRemove-image: " + eid);
      $('#' + eid).remove();
      self.render_canvas();
    }
  },

  onUpdate: function(img_model)  {
    var self = this;
    if (img_model) {
      var eid = img_model.get('eqid');
      console.log(" *onUpdate-image: " + eid);
      var found_images = $('img#' + eid);
      if (found_images) {
        // degrade image over time by adding noise
        // (of course this would be reset if the page were reloaded)
        var img = found_images[0];
        var jqimg = $(img);
        jqimg.pixastic("noise", {mono:true, amount:0.6, strength:3.15}).pixastic("blur");
      }
      self.render_canvas();
    }
  },

});

