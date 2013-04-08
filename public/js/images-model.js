
/*
    s	small square 75x75
    q	large square 150x150
    t	thumbnail, 100 on longest side

    m	small, 240 on longest side
    n	small, 320 on longest side

    -	medium, 500 on longest side

    z	medium 640, 640 on longest side
    c	medium 800, 800 on longest side†
    b	large, 1024 on longest side*
    o	original image, either a jpg, gif or png, depending on source format
*/

var ImageModel = Backbone.Model.extend({

  initialize: function() {
    console.log('img model');
    console.log(this);
    this.set('image_id', 'i' + this.get('id'));
    var url = this.find_first(['url_l', 'url_o', 'url_b', 'url_c', 'url_z']);
    if (url) {
      this.set('proxy_url', '/proxy?url=' + url);
    } else {
      console.log("GOING NOWHERE FAST!");
    }
  },

  find_first: function(list) {
    var self = this;
    _.each(list, function(item) {
      var candidate = self.get(item);
      if (candidate) {
        return candidate;
      }
    });
    return false;
  }

});


var ImageDataSource = Backbone.Collection.extend({
  model: ImageModel,

  initialize: function(options) {
    _.bindAll(this, 'flickr_search');
    this.whoami = 'ImageDataSource'; //debugging
  },

  // "Public API" - used from CombinedView:
  //    request_add
  //    request_remove
  //    request_update

  request_add: function(id, latitude, longitude, magnitude, depth) {
    // presently, magnitude & depth are ignored/not used.
    //console.log('ImageDataSource :: request_add');
    this.flickr_search({
      lon: longitude,
      lat: latitude,
      radius: 32
    });
  },

  flickr_search: function(params) {
        var self = this;
        var base_params = {
          api_key : cfg.key,
          sort : 'interestingness-desc',
          extras: 'description,media,url_sq,url_l,url_o,url_b',
          format : 'json',
          method : 'flickr.photos.search',
          per_page : 1,
          page : 1,
          license : ''
        };
        var data_params = _.extend(base_params, params);
        $.ajax({
            url : cfg.flickr_url,
            data : data_params,
            dataType : 'jsonp',
            jsonp : 'jsoncallback',
            success : function (response) {
                var photo_list = response.photos.photo;
                self.add(photo_list);
            }
        });
  },

  test: function() {
    var self = this;
    var o = {
      url: 'http://farm9.staticflickr.com/8369/8395417897_9fe9592eff_c_d.jpg',
      image_id: 3
    };
    o.proxy_url = '/proxy?url=' + o.url;
    self.add(o);
  },

  request_remove: function(image_id) {
    //console.log('ImageDataSource :: request_remove');
    var self = this;
    var model = self.get(image_id);
    self.remove(model);
  },

  request_update: function(image_id) {
    //console.log('ImageDataSource :: request_update');
    //TBD
  }

});

