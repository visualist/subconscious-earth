

var getViewport = function() {
    var _width = 1.0*($(window).width()), _height = 1.0*($(window).height()),
        _ratio = _width / (1.0 * _height),
        _orientation = (_ratio > 1.0)? 'landscape' : 'portrait';
    return {
        width: _width,
        height: _height,
        ratio: _ratio,
        orientation: _orientation
    };
};


//Global
var viewport;


function enqueue(url) {
  if (url) {
    //console.log("ENQUEUE: " + url);
    var proxy_url = '/proxy?url=' + url; // might need encoding of some sort
    //console.log("PROXY URL: " + proxy_url);
    var img = $('<img/>').attr({src: proxy_url});
    if (viewport.width > 50) {
      img.attr({width: viewport.width});
    }
    img.css({opacity: 0.11});
    $('#main').append(img);
  }
}


$(document).ready(function(){

  viewport = getViewport();


/*
  var c = new PhotoGroup({
    text: "s",
    per_page: 3,
    lon: -91.0,
    lat: 45,

    onAdd: function(model, collection, options) {
      var url = model.get('url_l');
      if (!url) { url = model.get('url_b'); }
      if (!url) { url = model.get('url_sq'); }
      enqueue(url);
    }
  });
*/

  var c = new Corpus({id: 'Frankenstein-Shelley.txt' }); // use only sections 3..57 
  var eqData = new EqDataSource();

  eqData.on("add", function(eq) {
    var event_id = eq.get('event_id');
    var lat = eq.get('lat');
    var lon = eq.get('lon');
    var mag = eq.get('mag');
    var depth = eq.get('depth') || '0';
    var time = eq.get('time');

    var eqevent = event_id + '/' + time;
    var strength = mag + ' / ' + depth;
    var latlon = '(' + lat + ',' + lon + ')';

    var s = eqevent + ': ' + strength + ' ' + latlon;
    var li_element = '<li id="' + event_id +  '">' + s + '</li>';
    $('#main').append(li_element);
    console.log(s);
  });

  eqData.on("remove", function(eq) {
    var event_id = eq.get('event_id');
    var css_id = '#' + event_id;
    $(css_id).remove();
    console.log("Removed: " + event_id);
  });

  eqData.miso_fetch(); //begin


/*
    onEq: function() {
      var s = self.eq_events[eqe];
      var words = self.corpus.by_location(s.lon, s.lat, s.dep, s.mag);
      //self.corpus.render(words, s.lon, s.lat, s.dep, s.mag);
      console.log(words + '@@' + s.mag );
    }
*/


});


