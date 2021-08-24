//////////////////////////////////////////////////////////////////////
// simple web server for static files for indev
// do not use for production!
// -----
// Copyright (c) Kiruse 2021. Licensed under GPL-3.0
var statik = require('node-static');
var http = require('http');

var file = new(statik.Server)(__dirname, {cache: 0, defaultExtension: 'html'});

http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(8080);
