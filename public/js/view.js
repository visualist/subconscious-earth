
// hard-coded for debugging..
window.viewport = {
      width: 55,
      height: 104
};


var ImagesView = Backbone.View.extend({

  initialize: function(options) {
    this.collection.on("add", this.onAdd);
    this.collection.on("remove", this.onRemove);
    this.collection.on("update", this.onUpdate);
    this.__whoami = 'ImagesView'; //debugging
  },

  onAdd: function(img_model) {
    var vp_width = viewport.width;
    var url = img_model.get('proxy_url');
    var iid = img_model.get('image_id');
    console.log("add-image: " + iid + " for " + img_model.get('eqid'));

    var opacity_by_mag = (parseFloat(img_model.get('mag')) / 12.0);
    var img = $('<img/>').attr({src: url, id: iid});
    if (vp_width > 50) {
      img.attr({width: vp_width});
    }
    img.css({opacity: opacity_by_mag});
    $('#images').append(img);
  },

  onRemove: function(img_model) {
    var iid = img_model.get('image_id');
    console.log("remove-image: " + iid);
    $('#' + iid).remove();
  },

  onUpdate: function(img_model)  {
  },

});


// CombinedView works more like a controller, passes requests
// through to the 'image_data' reference to add/update EQ events.

var CombinedView = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this, 'onAdd', 'onRemove', 'onUpdate');
    this.collection.on("add", this.onAdd, this);
    this.collection.on("remove", this.onRemove, this);
    this.collection.on("update", this.onUpdate, this);
    this.image_data = options.image_data;
    this.__whoami = 'CombinedView'; //debugging
  },

  onAdd: function(eq) {
    var event_id = eq.get('event_id');
    var lat = eq.get('lat');
    var lon = eq.get('lon');
    var mag = eq.get('mag');
    var depth = eq.get('depth') || '0';
    var time = eq.get('time');

    // convenience strings
    var eqevent = event_id + '/' + time;
    var strength = mag + ' / ' + depth;
    var latlon = '(' + lat + ',' + lon + ')';

    // build the markup
    var s = eqevent + ': ' + strength + ' ' + latlon;
    var li_element = '<li id="' + event_id +  '">' + s + '</li>';

    // show the event in text:
    //$('#eq-events').append(li_element);
    console.log(s);

    // trigger image display:
    this.image_data.request_add(event_id, lat, lon, mag, depth);
  },

  onRemove: function(eq) {
    var event_id = eq.get('event_id');
    var css_id = '#' + event_id;
    $(css_id).remove();
    this.image_data.request_remove(event_id);
  },

  onUpdate: function(eq)  {
    var event_id = eq.get('event_id');
    //console.log("update: " + event_id);
    this.image_data.request_update(event_id);
  },


  // (render not really used here)
/*
  render: function() {
    console.log("CombinedView: RENDER");
  }
*/

});

