var path = require('path');
var fs   = require('fs');

module.exports = function(publicPath, dest, filename) {
  filename = filename || 'rev-manifest.json';

  return function() {
    this.plugin("done", function(stats) {
      var stats    = stats.toJson();
      var chunks   = stats.assetsByChunkName;
      var manifest = {};

      console.log("====================================");

      for (var key in chunks) {
        console.log(key);
        var originalFilename = key + '.js';
        manifest[path.join(publicPath, originalFilename)] = path.join(publicPath, chunks[key])
      }
      console.log("====================================");

      fs.writeFileSync(
        path.join(process.cwd(), dest, filename),
        JSON.stringify(manifest)
      )
    })
  }
};
