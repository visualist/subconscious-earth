
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

  initialize: function(ignore1, options) {
    this.set('depth', options.depth);
    this.set('eqid', options.eqid);
    this.set('search', options.search);
    console.log("IMAGE MODEL(" + options.eqid + ")");
    this.set('mag', options.mag);
    this.set('image_id', 'i' + this.get('id'));

    var url = this.find_first(['url_l', 'url_o', 'url_b', 'url_c', 'url_z', 'url_sq']);
    if (url) {
      var eqid = this.get('eqid');
      console.log("-flickr image for eq " + eqid + "at " + url);
      this.set('proxy_url', '/proxy?url=' + url);
    } else {
      console.log("No available URL found for " + this.get('id'));
    }
  },

  find_first: function(list) {
    var self = this;
    for (var i = 0; i < list.length; i++) {
      var candidate = self.get(list[i]);
      if (candidate) {
        return candidate;
      } 
    }
    return false;
  }

});


var ImageDataSource = Backbone.Collection.extend({
  model: ImageModel,

  initialize: function(options) {
    _.bindAll(this, 'flickr_search', 'secondary_search',
                    'request_add', 'request_remove', 'request_update');
    this.__whoami = 'ImageDataSource'; //debugging
    this.base_params = {
      api_key : cfg.key,
      sort : 'interestingness-desc',
      extras: 'description,media,url_sq,url_l,url_o,url_b',
      format : 'json',
      method : 'flickr.photos.search',
      per_page : 1,
      page : 1,
      license : ''
    };
  },

  // "Public API" - used from EqEventController (aka CombinedView):
  //    request_add
  //    request_remove
  //    request_update

  request_add: function(id, latitude, longitude, magnitude, depth) {
    console.log("  ImageDataSource: request_add(" + id + " ..)");
    // presently, magnitude & depth are ignored/not used.
    //console.log('ImageDataSource :: request_add');

    // TODO: change this call-interface, fold into a single object.
    this.flickr_search({
      lon: longitude,
      lat: latitude,
      radius: 32
    },{
      __whoami: 'rider',
      lon: longitude,
      lat: latitude,
      mag: magnitude,
      depth: depth,
      eqid: id,
      search: 'primary'
    });
  },

  flickr_search: function(params, rider) {
        var self = this;
	var data_params = {};
        _.extend(data_params, self.base_params, params);
        $.ajax({
            url : cfg.flickr_url,
            data : data_params,
            dataType : 'jsonp',
            jsonp : 'jsoncallback',
            success : function (response, msg) {
                var photo_list = response.photos.photo;
                var result_count = photo_list.length;
                console.log("  Flickr-search response: " + msg + " (" + rider.eqid + ") " + result_count);
                if (photo_list instanceof Array && result_count > 0) {
                  self.add( photo_list, rider );
                } else {
                  self.secondary_search(rider);
                }
            },
            error : function(response, msg) {
                console.log(" *Flickr-search error response: " + msg);
            }
        });
  },

  secondary_search: function(eq_event) {
        //console.log("Secondary search");
        var self = this;
        var params = {
            text: 'farm'
        };
        eq_event['search'] = 'secondary';
	var data_params = {};
        _.extend(data_params, self.base_params, params);
        $.ajax({
            url : cfg.flickr_url,
            data : data_params,
            dataType : 'jsonp',
            jsonp : 'jsoncallback',
            success : function (response, msg) {
                var photo_list = response.photos.photo;
                var result_count = photo_list.length;
                console.log("  Secondary-search response: " + msg + " (" + eq_event.eqid + ") " + result_count);
                if (photo_list instanceof Array && result_count > 0) {
                  self.add( photo_list, eq_event );
                }
            },
            error : function (response, msg) {
                console.log(" *Secondary-search error response: " + msg);
            },
        });
  },

  request_remove: function(image_id) {
    //console.log("  ImageDataSource: request_remove(" + image_id + ")");
    var self = this;
    var model = self.get(image_id);
    self.remove(model);
  },

  request_update: function(image_id) {
    //console.log("  ImageDataSource: request_update(" + image_id + ")");
    //TBD
  }

});

