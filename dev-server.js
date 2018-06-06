var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var hostname = '0.0.0.0';
var port = 8080;
new WebpackDevServer(webpack(config), {
  contentBase: 'build/',
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: false,
  historyApiFallback: {
    rewrites: [
        {
            from: /^\/view\/[.0-9]+$/,
            to: function() {
                return 'index.html';
            }
        }
    ]
  },
  // historyApiFallback: true,
  proxy: {
      "/api": {
        target: "http://192.168.1.118:5000",
        // headers: {
        //   'Content-Type': 'application/json; charset=utf-8'
        // }
      },
      "/auth": {
        target: "http://192.168.1.118:5000",
        // headers: {
        //   'Content-Type': 'application/json; charset=utf-8'
        // }
      },
      "/socket.io" : {
        target: "http://192.168.1.118:6000",
        ws: true
      }
    }
}).listen(port, hostname, function (err, result) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at ' + hostname + ':' + port);
});
