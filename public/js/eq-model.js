
var Earthquake = Backbone.Model.extend({
  initialize: function() {
    var self = this;
    self.event_id = this.get('event_id');
    self.lat = this.get('lat');
    self.lon = this.get('lon');
    self.mag = this.get('mag');
    self.depth = this.get('depth');
    self.time = this.get('time');
    self.__whoami = 'Earthquake(model)';
  }
});



var default_frequency = 60000;
var default_url = '/proxydata?url=http://earthquake.usgs.gov/earthquakes/feed/v0.1/summary/all_hour.csv';


var EqDataSource = Backbone.Collection.extend({
  model: Earthquake,

  initialize: function(models, options) {
    var self = this;
    self.frequency = default_frequency;
    self.url = default_url;
    if (options) {
      self.frequency = options.frequency || default_frequency;
      self.url = options.url || default_url;
    }
    self.__whoami = 'EqDataSource(collection)';
    self.eqs = new Miso.Dataset({
      url: self.url,
      interval : self.frequency,
      resetOnFetch: true, // let Backbone accumulate data, not Miso
      delimiter : ","
    });
  },

  miso_fetch: function() {
    var self = this;
    var _eq_events = {};

    self.eqs.fetch({
      success: function() {
        var _existing = _.map(self.models, function(m) {return m.get('id');});
        var _new = []; //incoming from fetch, determined in 'loop' below

        this.each(function(row){
          var event_id = row.EventID;
          // all "NEW events" coming in this fetch-round..
          _new.push(event_id);
          if (! _eq_events[event_id]) {
            var earthquake_event = {
              id       : event_id,
              event_id : event_id,
              time     : row.DateTime,
              lon      : row.Longitude,
              lat      : row.Latitude,
              depth    : row.Depth,
              mag      : row.Magnitude,
              magtype  : row.MagType,
              nbstations : row.NbStations,
              gap      : row.Gap,
              distance : row.Distance,
              rms      : row.RMS,
              source   : row.Source,
              version  : row.Version,
              rendered : false
            };
            _eq_events[event_id] = earthquake_event;
            // Note: the 'add' could go here
          }
        });

        // Enter, Exit, Update : concepts borrowed from D3
        var _enter = _.difference(_new, _existing);
        var _exit = _.difference(_existing, _new);
        var _update = _.intersection(_new, _existing);

        /*
         *   _new       ==  new/incoming items from the USGS API
         *   _existing  ==  current items
         *
         *   _enter     ==  added to active list
         *   _exit      ==  removed from active list
         *   _update    ==  no change from previous round
         */

        console.log("Enter:" + _enter.length +
                  ", Exit:" + _exit.length +
                  ", Update:" + _update.length);

        _.each(_enter, function(eq_event_id){
          var earthquake_event = _eq_events[eq_event_id];
          self.add(earthquake_event);
        });

        _.each(_exit, function(eq_event_id){
          var model = self.get(eq_event_id);
          self.remove(model);
        });

        _.each(_update, function(eq_event_id) {
          var model = self.get(eq_event_id);
          self.trigger("update", model);
        });

      },//end-success

      error: function(e) {
        console.log("Oops!");
      }

    }); //fetch
  },//miso-fetch

});

