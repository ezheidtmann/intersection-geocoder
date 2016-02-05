'use strict';

var _ = require('underscore');
var turf = require('turf');

module.exports = function(data, tile, writeData, done) {
  var features = (data.streets && data.streets.road_label && data.streets.road_label.features) || [];
  var buffered_features = _.map(features, function(f) {
    var buffered_feature = turf.buffer(f, 2, 'meters').features[0];
    buffered_feature.properties = f.properties;
    return buffered_feature;
  });
  buffered_features = _.filter(buffered_features, function(f) { return f.geometry && f.geometry.type === 'Polygon' });
  var intersection;
  var results = [];

  for (var i = 0; i < buffered_features.length; ++i) {
    for (var j = i+1; j < buffered_features.length; ++j) {
      intersection = turf.intersect(buffered_features[i], buffered_features[j]);
      if (intersection !== undefined) {
        results.push({
          'i': buffered_features[i].properties,
          'j': buffered_features[j].properties,
          'centroid': turf.centroid(intersection),
        });
      }
    }
  }
  done(null, results);
}
