
//console.log("flickr-model.js");

window.cfg = {};
cfg.console_log = console.log;
cfg.flickr_url = 'http://api.flickr.com/services/rest/';
cfg.key = '0464d0aeec2d83adbafe505502b91ce5';
cfg.user = '7587371@N06';


var Photo = Backbone.Model.extend({
    //model: Photo,

    /* Initialization parameters:
     *   url   the location of the image [required]
     */
    initialize: function(options) {
        var model = this;
        // console.log("Flickr-URL: " + options.url);
        model.url = options.url;

        model.loaded = false;
        model.msg = model.cid + ' image';
    },

    fetch_image: function() {
        var model = this;
        model.loaded = false;
        model.image = new Image(); // a DOM Image object
        model.image.onload = function(ev) {
            var _height = model.image.height;
            var _width = model.image.width;
            var _ratio = _width / (1.0 * _height);
            var _orientation = (_ratio > 1.0) ? 'landscape' : 'portrait';

            if (_width === 0 || _height === 0) {
                return; // do nothing if it "failed"
            }

            // TODO: considering these 4 items as one object (future)
            model.height = _height;
            model.width = _width;
            model.ratio = _ratio;
            model.orientation = _orientation;

            model.loaded = true;
            if (cfg.console_log) {
                console.log("    Photo#fetch_image: Photo LOADED " + model.msg);
                //console.log(ev);
                //console.log("---");
            }
            model.trigger("photo:ready", model);
        };
        model.image.onerror = function() {
            if (cfg.console_log) {
                console.log("    Photo#fetch_image: Photo ERROR while loading");
            }
        };
        if (cfg.console_log) {
            console.log("    Photo#fetch_image: BEGIN-load " + model.msg);
        }
        model.image.src = model.url; //browser loads the image
    }
});

var Scene = Backbone.Model.extend({
    
});

var PhotoGroup = Backbone.Collection.extend({
    model: Scene,

    /*
     * API:
     *  - First: show/goto first (using project page if available)
     *  - Last: (maybe also) show/goto last
     *  - Next: (move to)
     *  - Prev: (move to)
     * And maybe:
     *  - get representative thumbnail image for set (for portfolio/index)
     *  - get image text (for current)
     */

    initialize: function(options) {
        var self = this;
        this.text = options.text;
        this.current_index = 0;
        this.current = null;
        this.per_page = options.per_page ? options.per_page : 5;
        this.lon = options.lon;
        this.lat = options.lat;
        var on_add = options.onAdd;
        if (on_add) {
          self.on("add", on_add);
        }
        var on_metadata = options.onMetadata;
        if (on_metadata) {
          self.on("metadata", on_metadata);
        }
        this._load_metadata(); // start things into motion
    },

    fetch: function(params, success) {
        var self = this;
        success = success || $.noop;
        this.params = params || this.params;
        var data_params = {
          api_key : cfg.key,
          sort : 'interestingness-desc',
          text : self.text,
          extras: 'description,media,url_sq,url_l,url_o,url_b',
          format : 'json',
          method : 'flickr.photos.search',
          per_page : self.per_page,
          page : 1,
          license : ''
        };

        if (self.lon && self.lat) { 
          data_params['lon'] = self.lon;
          data_params['lat'] = self.lat;
          data_params['radius'] = 32;
        }
        $.ajax({
            url : cfg.flickr_url,
            data : data_params,
            dataType : 'jsonp',
            jsonp : 'jsoncallback',
            success : function (response) {
                var photo_list = response.photos.photo;
//console.log('photo_list');
//console.log(photo_list);
                self.add(photo_list);
                success(self);
            }
        });
    },

    //onAdd: function() {},
    //onMetadata: function() {},

    // PRIVATE - initialization

    _load_metadata: function() {
        // start loading Scene models
        // set models into motion.
        this.fetch({}, this._metadata_success);
    },

    _metadata_success: function(model) {
      // 'model' passed-in via callback
      // Note: scene model metadata loaded only, not necessarily Images
      model.gallery_size = model.size();
      var counter = 1;
      _.each(model.models, function(item){
          item.number = counter;
          counter += 1;
      });
      //model.jumpToFirst();
      model.trigger("metadata", model);
    },

    // PRIVATE - navigation

    _get_next_index: function() {
        var max = this.gallery_size - 1;
        var next_index = this.current_index + 1;
        if (next_index > max) {
          next_index = 0;
        }
        return next_index;
    },

    _get_prev_index: function() {
        var prev_index = this.current_index - 1;
        if (prev_index < 0) {
          prev_index = this.gallery_size - 1;
        }
        return prev_index;
    },

    _set_pointers: function() {
        // Set current, next, prev.
        // The only assumption is 'current_index' is properly
        // set before entering this method.
        this.current = this.at(this.current_index);
        var n = this.next_index = this._get_next_index();
        this.next = this.at(n);
        var p = this.prev_index = this._get_prev_index();
        this.prev = this.at(p);

        this._load_images_at_pointers();
    },
    _load_images_at_pointers: function() {
        var model = this;
        // At this point, 'current', 'next' and 'prev' are ready to use,
        // start loading/pre-loading the images:
        if (cfg.console_log) {
            console.log("    PhotoGroup#_load_images_at_pointers: SETUP Current");
        }

        var currentScene = model.current;

        // TODO: Need a better flag than (width>0) to know it is OK to use this:
        if (currentScene.ready) {
            /*
             * Consider at this point passing which image to use
             * instead of relying on the View to poke into the
             * models to figure that out.
             *   "push" rather than "interrupt then pull"
             */
            model.trigger("current");
        } else {
            if (cfg.console_log) {
                console.log("    PhotoGroup#_load_images_at_pointers: current not ready");
            }
            currentScene.on("scene:imageloaded", function() {
                model.trigger("current");
            });
            currentScene.loadImages();
        }

        // TODO: do the same for previous and next..
    },


    /* =============== PUBLIC API Methods =============== */

    /*
     * Consider whether to keep 'current' an attribute
     * which is used externally (view) or to make it a
     * method within these API calls. Associated with
     * this would be calls for 'next' and 'previous'
     * to support the View's notion of read-head during
     * swipe gestures. I think the latter approach is
     * better. -ws 10/14
     */

    // Question: whether to provide these getter-methods
    //  or simply allow access to the equivalent attributes?
    getCurrent:  function() { return this.current; },
    getNext:     function() { return this.next; },
    getPrevious: function() { return this.prev; },

    moveNext: function() {
        var model = this;
        var c = model._get_next_index();
        model.current_index = c;
        model._set_pointers();
    },

    movePrev: function() {
        var model = this;
        var c = model._get_prev_index();
        model.current_index = c;
        model._set_pointers();
    },

    // Go to 'first' photo -or- 'project page' if one exists.
    //   Q: should going-to project page be a separate method?
    jumpToFirst: function() {
        var model = this;
        model.current_index = 0;
        model._set_pointers();
    },

    jumpToLast: function() {
        var model = this;
        model.current_index = model.gallery_size - 1;
        model._set_pointers();
    }
    // TODO: rethinking this, might rather want to put/keep
    //  this functionality into the model itself. 'current'
    //  as returned from the other API calls gives the caller
    //  the needed access to the model, so why not? This would
    //  be more flexible for prev, next references as well.
    //  And other model attributes are already there, so this
    //  is also a more consistent treatment.  -ws 10/14
    //getText: function() { },

});

