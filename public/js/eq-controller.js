
// EqEventController (aka CombinedView) works more like a controller, passes
// requests through to the 'image_data' reference to add/update EQ events.

var EqEventController = Backbone.View.extend({

  initialize: function(options) {
    _.bindAll(this, 'onAdd', 'onRemove', 'onUpdate');
    this.collection.on("add", this.onAdd, this);
    this.collection.on("remove", this.onRemove, this);
    this.collection.on("update", this.onUpdate, this);
    this.image_data = options.image_data;
    this.__whoami = 'EqEventController'; //debugging
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
    //console.log(s);

    // trigger image display:
    //this.image_data.request_add(event_id, lat, lon, mag, depth);
    if (this.image_data) {
      var imageAdd = this.image_data.request_add;
      if (imageAdd) {
        //console.log(" >imageAdd(" + event_id + ")");
        imageAdd(event_id, lat, lon, mag, depth);
      }
    }
  },

  onRemove: function(eq) {
    var event_id = eq.get('event_id');
    var css_id = '#' + event_id;
    //$(css_id).remove();
    if (this.image_data) {
      var imageRemove = this.image_data.request_remove;
      if (imageRemove) {
        //console.log(" >imageRemove(" + event_id + ")");
        imageRemove(event_id);
      }
    }
  },

  onUpdate: function(eq)  {
    if (this.image_data) {
      var imageUpdate = this.image_data.request_update;
      if (imageUpdate) {
        var event_id = eq.get('event_id');
        //console.log(" >imageUpdate(" + event_id + ")");
        imageUpdate(event_id);
      }
    }
  }

});

