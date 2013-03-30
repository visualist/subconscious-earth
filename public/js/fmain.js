

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
    var img = $('<img/>').attr({src: url});
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
  var eqData = new EqData({corpus: c});
  eqData.miso_fetch();

});


