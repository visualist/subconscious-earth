
var ImageModel = Backbone.Model.extend({
  initialize: function() {
    this.set('image_id', '654321');
    this.set('proxy_url', '/proxy?url=' + this.get('url_o'));
    console.log("Image Model:");
    console.log(this);
  }
});


var ImageDataSource = Backbone.Collection.extend({
  model: ImageModel,

  initialize: function(options) {
    var self = this;
    _.bindAll(this, 'flickr_success');
    self.whoami = 'ImageDataSource'; //debugging
    // TODO: setup Flickr stuff here
  },

  // Public API called from CombinedView:
  //   request_add
  //   request_remove
  //   request_update

  // request_add is really 'enqueue'
  //   .. since Flickr will take a bit of time. Then, the callback
  //   will do the real add and create the ImageModel instance.
  request_add: function(id, latitude, longitude, magnitude, depth) {
    // presently, magnitude & depth are ignored/not used.
    console.log('ImageDataSource :: request_add');
    this.flickr_search({
      lon: longitude,
      lat: latitude,
      radius: 32
    }, this.flickr_success);
  },

  flickr_success: function(i) {
    console.log("Flickr SUCCESS");
    console.log( i );
  },

  // flickr_search({
  //   text: 'search text of some type',
  //   lon: longitude
  //   lat: latitude
  //   radius: 32
  // }, callback_function);
  flickr_search: function(params, success) {
        var self = this;

        success = success || $.noop;

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
        console.log('data_params');
        console.log(data_params);

        $.ajax({
            url : cfg.flickr_url,
            data : data_params,
            dataType : 'jsonp',
            jsonp : 'jsoncallback',
            success : function (response) {
                var photo_list = response.photos.photo;
                //console.log('photo_list');
                //console.log(photo_list);
                console.log('->self');
                console.log(self);

                //success(photo_list);
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

  request_remove: function(id) {
    console.log('ImageDataSource :: request_remove');
    var self = this;
    var model = self.get(eq_event_id);
    self.remove(model);
  },

  request_update: function(id) {
    console.log('ImageDataSource :: request_update');
    //TBD
  }

});

