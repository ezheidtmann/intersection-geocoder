'use strict';

var tileReduce = require('tile-reduce');
var path = require('path');
var turf = require('turf');

var numFeatures = 0;

var center_point = {
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [-122.660253, 45.558113],
  },
};

var bbox = turf.extent(turf.buffer(center_point, 10, 'meters'));

var closest_intersection = undefined;
var minDist_km = 1;

tileReduce({
  bbox: bbox,
  zoom: 18,
  map: path.join(__dirname, 'extract_intersections.js'),
  sources: [
    {
      name: 'streets', 
      url: 'https://b.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiZXpoIiwiYSI6IlpQQ01TR2cifQ.LuIx3e1Ez52srjbRHymXNg',
      layers: ['road_label'],
      maxrate: 10,
    }
  ]
})
.on('map', function(tile, workerId) {
})
.on('reduce', function(intersections, tile) {
  for (var i = 0; i < intersections.length; ++i) {
    var intersection = intersections[i];
    var dist_km = turf.distance(intersection.centroid, center_point);
    if (dist_km < minDist_km) {
      closest_intersection = intersection;
      minDist_km = dist_km;
    }
  }
})
.on('end', function() {
  console.log('Closest intersection');
  var intersection = closest_intersection;
  console.log(intersection.i.name, '&', intersection.j.name, intersection.centroid.geometry.coordinates);
});
