
/* Corpus: body of text */

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

    if (mag>9.9) { mag = 9.9; } // hope it never happens!
    var factor = 10.0 / 3;
    var word_len = Math.ceil((10 - mag)/factor);

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
  }

//,

  /* TODO: move this into a VIEW */
/*
  render: function(words, lon, lat, dep, mag) {
    console.log(words + '@' + mag );
  }
*/

});

