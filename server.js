const express = require('express');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');
const path = require('path');
const port = process.env.PORT || 80;
const app = express();

app.use('/auth', proxy({target: 'http://192.168.1.118:5000', changeOrigin: true}));
app.use('/api', proxy({target: 'http://192.168.1.118:5000', changeOrigin: true}));
var wsProxy = proxy({target: 'ws://192.168.1.118:6000', changeOrigin: true, ws: true, logLevel: 'debug'})
app.use('/socket.io', wsProxy);

//加载指定目录静态资源
app.use(express.static(__dirname + '/build'))

app.use(history({
  index: '/',
  verbose: true,
}));

app.get('/', function (request, response){
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

var server = app.listen(port, function () {
  console.log("server started on port " + port)
})

server.on('upgrade', wsProxy.upgrade)
