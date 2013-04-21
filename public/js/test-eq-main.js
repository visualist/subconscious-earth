
$(document).ready(function(){

  var eqData = new EqDataSource(null, {
    frequency: 6000,
    url: '/data/test.csv',
  });

  var testController = new EqEventController({
    collection: eqData,
    image_data: {

      request_add: function(id, lat, lon, mag, depth) {
        //console.log("    => add(" + id + " ..)");
      },

      request_remove: function(id) {
        //console.log("    => remove(" + id + ")");
      },

      request_update: function(id) {
        //console.log("    => update(" + id + ")");
      }
    }
  });

  eqData.miso_fetch();
});

