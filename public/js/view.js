
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
var once = 1;

function render_to_1canvas(im) {
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
  ctx.globalAlpha = 0.1;
  ctx.drawImage(im,0,0, viewport.width, viewport.height);
}

function render_to_canvases(im) {
  var canvas = document.createElement('canvas');
  var canvases = document.getElementById("canvases");
  canvases.appendChild(canvas);
  canvas.width  = viewport.width;
  canvas.height = viewport.height;
  var ctx = canvas.getContext('2d');
  ctx.globalAlpha = 0.1;
  ctx.drawImage(im,0,0);
}

function render_to_sequence(im) {
  $('#sequence').append(im);
}

function render_to_overlapping_divs(im) {
  $('#images').append(im);
}

function render_canvas(im) {
  $('#hidden-images').append(im);
  render_to_1canvas(im);
}



var ImagesView = Backbone.View.extend({

  initialize: function(options) {
    this.collection.on("add", this.onAdd);
    this.collection.on("remove", this.onRemove);
    this.collection.on("update", this.onUpdate);
    this.__whoami = 'ImagesView'; //debugging
  },

  onAdd: function(img_model) {
    var self = this;
    var vp_width = viewport.width;
    var url = img_model.get('proxy_url');
    var iid = img_model.get('image_id'); // flickr image id
    var eid = img_model.get('eqid');
    console.log("add-image: iid=" + iid + " for " + img_model.get('eqid'));

    var opacity_by_mag = (parseFloat(img_model.get('mag')) / 12.0);

    var img = new Image();
    img.onload = function(ev) {
      var img_elem = ev.srcElement;
      //render_to_overlapping_divs(img_elem);
      //render_to_sequence(img_elem);
      //render_to_canvases(img_elem);
      //render_to_1canvas(img_elem);
      render_canvas(img_elem);
      console.log(" *onAdd-image(rendered): " + eid);
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

