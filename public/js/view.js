
var CombinedView = Backbone.View.extend({

  initialize: function() {
    this.collection.on("add", this.onAdd);
    this.collection.on("remove", this.onRemove);
    this.collection.on("update", this.onUpdate);
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
    $('#eq-events').append(li_element);
  },

  onRemove: function(eq) {
    var event_id = eq.get('event_id');
    var css_id = '#' + event_id;
    $(css_id).remove();
  },

  onUpdate: function(eq)  {
    var event_id = eq.get('event_id');
    //console.log("update: " + event_id);
  },


  // (render not really used)
  render: function() {
    console.log("CombinedView: RENDER");
  }

});
