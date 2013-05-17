
//Globals
var viewport;
var imgData;
window.cfg = {};


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


function enqueue(url) {
  if (url) {
    var proxy_url = '/proxyimage?url=' + url;
    var img = $('<img/>').attr({src: proxy_url});
    if (viewport.width > 50) {
      img.attr({width: viewport.width});
    }
    img.css({opacity: 0.11});
    $('#images').append(img);
  }
}


$(document).ready(function(){
  viewport = getViewport();
  var corpus_text = 'Made-Up.txt';
  window.corpus = new Corpus({id: corpus_text });

      imgData = new ImageDataSource();
  var imagesView = new ImagesView({collection: imgData});

  var eqData = new EqDataSource();
  var controller = new EqEventController({
    collection: eqData,
    image_data: imgData
  });

  eqData.miso_fetch();
});

