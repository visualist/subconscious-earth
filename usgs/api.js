var usgs = usgs || {};
usgs.util = usgs.util || {};
 
usgs.util.FeaturedItems = (function () {
     
    var DEFAULTS = {
        advanceInterval: 5000,
        xFadeSpeed: 750
    };
 
    var FeaturedItems = function (id) {
        var _this = this;              // (FeaturedItems)
        var _id = id;                  // (String)
        var _options = {};             // (Object)
        var _itemsList = $('#' + _id); // (jQuery) List of featured items
        var _wrapperDiv = null;        // (jQuery) Wrapper for featured items 
        var _controlDiv = null;        // (jQuery) Controls for featured items
        var _advanceTimeout = null;    // (Timeout) 
         
        this.initialize = function (options) {
            // Extend our options with given parameters
            $.extend(_options, DEFAULTS, options || {});
 
            // Wrap the list of featured items
            $(_itemsList).wrap('<div class="featured-items-wrapper"></div>');
            _wrapperDiv = $('#' + _id).parent('.featured-items-wrapper');
 
            // Inject a control container for the list of featured items
            $('<div class="controls"></div>').insertBefore(_itemsList);
            _controlDiv = $('.controls', _wrapperDiv);
 
            // UI component to indicate to user that we are now paused
            _wrapperDiv.append('<span class="pause" title="Auto-advance paused. ' +
                    'Remove mouse from featured item to continue auto-advance.">' +
                    '||</span>');
 
            // Add a navigation control for each item in our _itemsList
            $('> li', _itemsList).each(function (index, element) {
                var e = $(element);
 
                // Create the control
                var nav = $(['<span title="', $.trim($('h3 a',e).text()),
                        '" class="controlButton">', index+1, '</span>'].join(''));
 
                // Add a click handler
                nav.click(function (event) { _this.jumpTo(index); });
 
                // Inject into the DOM
                _controlDiv.append(nav);
 
                // Hide the current element
                _hideItem(e, true);
            });
 
            // Pause carosel when user mouses over and start again on mouse out
            _wrapperDiv.mouseenter(function (e) { _this.stop(); });
            _wrapperDiv.mouseleave(function (e) { _this.start(); });
 
            // TODO :: Should we listen on the _controlDiv and _itemsList also?
 
            // Show the first featured item.
            _this.jumpTo(0, true);
        };
 
        this.start = function () {
            if (_advanceTimeout === null && $('> li', _itemsList).length > 1) {
                _advanceTimeout = window.setInterval(
                    'usgs.util.FeaturedItems.CAROSELS["' + _id + '"].advance();',
                    _options.advanceInterval);
            }
        };
 
        this.stop = function () {
            if (_advanceTimeout) {
                window.clearTimeout(_advanceTimeout);
                _advanceTimeout = null;
            }
        };
 
        this.advance = function () {
            // Find currently visible item
            var currentItem = $('> li:visible', _itemsList);
            if (currentItem.length === 0) {
                currentItem = $('> li:first-child', _itemsList);
            }
 
            // Find next item to show
            var nextItem = currentItem.next('li');
            if (nextItem.length === 0) {
                nextItem = $('> li:eq(0)', _itemsList);
            }
 
            // Find control for currently visible item
            var currentControl = $('> span.current', _controlDiv);
            if (currentControl.length === 0) {
                currentControl = $('> span:first-child', _controlDiv);
            }
 
            // Find control for next item to show
            var nextControl = currentControl.next('span');
            if (nextControl.length === 0) {
                nextControl = $('> span:first-child', _controlDiv);
            }
 
            // Hide current item and show next item
            _hideItem(currentItem, false, function () {
                if (nextItem) { _showItem(nextItem); }
            });
 
            // Deselect current control and select next control
            if (currentControl) { _deselectControl(currentControl); }
            if (nextControl) { _selectControl(nextControl); }
 
        };
 
        this.jumpTo = function (index, firstTime) {
            var currentItem = $('> li:visible', _itemsList);
            var nextItem = $($('> li', _itemsList).get(index));
            var currentControl = $('span.current', _controlDiv);
            var nextControl = $($('> span', _controlDiv).get(index));
 
            if (currentItem.length !== 0) {
                _hideItem(currentItem, firstTime, function () {
                    if (nextItem.length !== 0) { _showItem(nextItem, firstTime); }
                });
            } else if (nextItem.length !== 0) { _showItem(nextItem, firstTime); }
 
            if (currentControl.length !== 0) { _deselectControl(currentControl); }
            if (nextControl.length !== 0) { _selectControl(nextControl); }
        };
 
        // --------------------------------------------------
        // Private Methods
        // --------------------------------------------------
 
        var _showItem = function (element, first_show) {
            if (first_show) { $(element).show(); }
            else { $(element).fadeIn(parseInt(_options.xFadeSpeed, 10)); }
        };
 
        var _hideItem = function (element, first_hide, callback) {
            if (first_hide) { $(element).hide(); }
            else { $(element).fadeOut(parseInt(_options.xFadeSpeed, 10), callback); }
        };
 
        var _selectControl = function (control) {
            $(control).addClass('current');
        };
 
        var _deselectControl = function (control) {
            $(control).removeClass('current');
        };
 
        // Register this carosel at time of instantiation
        usgs.util.FeaturedItems.__register_carosel(_this, _id);
    };
 
    return FeaturedItems;
})();
 
usgs.util.FeaturedItems.CAROSELS = {};
usgs.util.FeaturedItems.__register_carosel = function (carosel, name) {
    if (usgs.util.FeaturedItems.CAROSELS[name]) {
        usgs.util.FeaturedItems.CAROSELS[name].stop();
        usgs.util.FeaturedItems.CAROSELS[name] = null;
    }
    usgs.util.FeaturedItems.CAROSELS[name] = carosel;
};
