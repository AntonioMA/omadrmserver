'use strict';

var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');


var processRequest = function(name, responseHeaders, request, response) {
    console.log(name + " server, processing petition");

    response.writeHead(200, responseHeaders);

    var readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(response);
};

var filePath = path.join(__dirname, 'FL_binary_mp3_1.dm');
var size = fileSystem.statSync(filePath).size;
console.log("Size of the file to sent: "+ size);

var servers = [
  {
    name: "Inline server",
    port: 2001,
    config: {
      'Content-Type': 'application/vnd.oma.drm.message',
      'Content-Length': size,
      'Content-disposition': 'inline'
    }
  },
  {
    name: "Attachment server",
    port: 2002,
    config:   {
      //  'Content-Type': 'application/vnd.oma.drm.message',
      'Content-Type': 'application/vnd.oma.drm.message; boundary=boundary-1',
      'Content-Length': size,
      'Content-disposition': 'attachment;filename="Concierto_De_Aranjuez__1__Allegro_Con_Spirito___Paco_De_Lucia.dm"'
    }
  }
];

servers.forEach(function(server) {
  console.log("Creating " + server.name + " on port " + server.port);
  http.createServer(processRequest.bind(undefined, server.name, server.config)).
    listen(server.port);
});


