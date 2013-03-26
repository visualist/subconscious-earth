
$(document).ready(function() {
  get_data(process_data);
});

function get_data(fn) {
  $.jsonp({
    url: 'http://earthquake.usgs.gov/earthquakes/feed/geojsonp/all/hour',
    callback: "eqfeed_callback",
    success: function(json) {
      //console.log("Success w/$.jsonp");
      //console.log(json);
      fn(json.features);
    },
    error: function() {
       console.log("Failure w/$.jsonp");
    }
  });
}

function process_data(d) {

  _.each(d, function(row) {
    var geo_coord = row.geometry.coordinates;
    var geo_props = row.properties;
    // assume type point
    var coord = {
      longitude: geo_coord[0],
      latitude: geo_coord[1],
      //what: geo_coord[2]
    };
    console.log(coord);
    console.log(row);
// time, tz, mag
  });

}


