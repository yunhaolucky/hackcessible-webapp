function requestCurbsUpdate(layerGroup, map, api_url) {
  function drawCurbs(data) {
    // TODO: turn this into map tiles for several zoom levels to speed
    // things up (slowness is due to drawing so many lines)
    layerGroup.clearLayers();
    var bounds = map.getBounds();

    make_circle = function(feature, latlng) {
      return L.circleMarker(latlng, {
        'radius': 3,
        'color': '#0000FF'
      });
    };

    for (i = 0; i < data.length; i++) {
      var geoJSON = data[i];
      var coord = geoJSON.coordinates;
      var latlng = [coord[1], coord[0]];
      if (bounds.contains(latlng)) {
        point = L.geoJson(geoJSON, {pointToLayer: make_circle});

        //Display info when user clicks on the curb marker
        var popup = L.popup().setContent("<b>Curb Ramp</b>");
        point.bindPopup(popup);

        layerGroup.addLayer(point);
      }
    }
  }

bounds = map.getBounds().toBBoxString();
// Request data
$.ajax({
  type: 'GET',
  url: api_url + '/curbs.json',
  data: {
    bbox: bounds
  },
  dataType: 'json',
  success: function(data) {
    drawCurbs(data);
  }
});
}
