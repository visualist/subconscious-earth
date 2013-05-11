window.cfg = {};
//cfg.console_log = console.log;
cfg.flickr_url = 'http://api.flickr.com/services/rest/';
cfg.key = '2693b44e9b45ca1d5b20a9e9655c9036';


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
    $('#images').append(img);
  }
}


//here for debugging
  var imgData;


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

//var corpus_text = 'Frankenstein-Shelley.txt'; // use only sections 3..57 
//var corpus_text = 'Ulysses-Joyce.txt';
var corpus_text = 'Made-Up.txt';

window.corpus = new Corpus({id: corpus_text });

      imgData = new ImageDataSource();
  var imagesView = new ImagesView({collection: imgData});

  var eqData = new EqDataSource();
  var controller = new EqEventController({
    collection: eqData,
    image_data: imgData
  });

  eqData.miso_fetch();  // set the apparatus into motion

});


