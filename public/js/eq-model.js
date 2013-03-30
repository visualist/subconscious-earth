

var Earthquake = Backbone.Model.extend({
  initialize: function() {
    var self = this;
    self.event_id = this.get('event_id');
    self.lat = this.get('lat');
    self.lon = this.get('lon');
    self.mag = this.get('mag');
    self.depth = this.get('depth');
    self.time = this.get('time');
  }
});


var EqDataSource = Backbone.Collection.extend({
  model: Earthquake,

  events: {
    "eq" : "onEq"
  },

  initialize: function(options) {
    var self = this;
    //self.corpus = options.corpus;
    self.eq_events = {};
    self.eq_eventstack = [];
    self.eqs = new Miso.Dataset({
      url: '/proxy?url=http://earthquake.usgs.gov/earthquakes/feed/csv/all/hour',
      //url: '/proxy?url=http://earthquake.usgs.gov/earthquakes/feed/csv/2.5/day',
      interval : 60000, // once per minute
      //url: '/data/usgs3.csv',
      delimiter : ",",
    });
    self.on("eq", function() { self.onEq(); }, self);
  },

  miso_fetch: function() {
    var self = this;
    self.eqs.fetch({
      success: function() {
        //console.log('success');

        var how_many_changed = 0;
        this.each(function(row){
          // Question: does eq_events only ever accumulate?
          var event_id = row.EventID;

          if (!self.eq_events[event_id]) {
            //console.log("Adding: " + event_id);
            how_many_changed++;
            var earthquake_event = {
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
            self.eq_events[event_id] = earthquake_event;
            self.eq_eventstack.push(event_id);
            self.add(earthquake_event, {id: event_id});
          }

        });
        if (how_many_changed>0) {
          self.trigger("eq", how_many_changed);
        }
      },
      error: function(e) {
        console.log("Oops!");
      }
    });
  },

  onEq: function() {}

/*
  // TODO: fix.  This here for now
  onEq: function() {
    var self = this;
    console.log("EQ Event");
    _.each(self.eq_eventstack, function(eqe) {
      //console.log("ev: " + eqe);
      var s = self.eq_events[eqe];
      //console.log("mag: " + s.mag);
      words = self.corpus.by_location(s.lon, s.lat, s.dep, s.mag);
      //self.corpus.render(words, s.lon, s.lat, s.dep, s.mag);
      console.log(words + '@@' + s.mag );
    });
  }
*/

});


