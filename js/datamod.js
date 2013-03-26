

var Corpus = Backbone.Model.extend({
  urlRoot: '/data',

  initialize: function() {
    var self = this;
    self.t = '';
    var f = this.fetch();
    f.complete(function() {
      self.build(f.responseText, self);
    });
  },

  build: function(txt, context) {
    var self = context;
    self.t = _.compact(txt.split("\n\n\n"));

    // Prep and map the text-corpus
    self.len = self.t.length;

    // Then, trigger next thing here (send build-complete or ready or somesuch)
  },

  // use only sections 3..57 of Frankenstein
  by_location: function(lon, lat, dep, mag) { /* map location to corpus */
    var self = this;

    var hmap = lon + 180; // [0..360]
    var hscale = self.t.length;
    var section = self.t[Math.floor(hmap % hscale)];

    var vmap = lat + 90; // [0..180]
    var vscale = Math.floor(section.length*0.90);
    var strpos = Math.floor(vscale*(vmap/180));

    var word_len = Math.floor(2.3 + mag); //arbitrary increment
    var cleanstr = section.substr(strpos).replace(/[\n-,';:]/g," ").replace(/--/g," ");
    var nextword_i = cleanstr.search(" ");
    var w = cleanstr.substr(nextword_i).split(/ /);
    _.each(w, function(word, index) {
      if (word.length < 3 || word=='the') {
        delete w[index];
      }
    });
    var words = _.compact(w).slice(0, word_len);
    return words.join(" ");
  },

  /* TODO: move this into a VIEW */
  render: function(words, lon, lat, dep, mag) {
    console.log(words + '@' + mag );
  }

});


/* EQ DATA SOURCE */

var EqData = Backbone.Model.extend({
  events: {
    "eq" : "onEq"
  },

  initialize: function(options) {
    var self = this;
    self.corpus = options.corpus;
    self.eq_events = {};
    self.eq_eventstack = [];
    self.eqs = new Miso.Dataset({
      url: '/data/usgs2.csv',
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
            self.eq_events[event_id] = {
              time : row.DateTime,
              lon  : row.Longitude,
              lat  : row.Latitude,
              dep  : row.Depth,
              mag  : row.Magnitude,
              rendered : false
            };
            self.eq_eventstack.push(event_id);
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

  // TODO: fix.  This here for now
  onEq: function() {
    var self = this;
    //console.log("EQ Event");
    _.each(self.eq_eventstack, function(eqe) {
      //console.log("ev: " + eqe);
      var s = self.eq_events[eqe];
      //console.log("mag: " + s.mag);
      words = self.corpus.by_location(s.lon, s.lat, s.dep, s.mag);
      self.corpus.render(words, s.lon, s.lat, s.dep, s.mag);
    });
  }

});


