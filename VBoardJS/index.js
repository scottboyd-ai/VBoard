'use strict';

const Hapi = require('hapi');

//Use this server config to host it locally so you can access the project from other devices
const server = Hapi.server({
  port: 3000,
  // Get this IP address by running "ipconfig /all" in a command prompt (windows) and paste in your IPv4 address
  // Try not to commit changes to this config.
  host: '10.0.0.195'
});
// const server = Hapi.server({
//     port: 3000,
//     host: 'localhost'
// });

const init = async () =>{

  await server.register(require('inert'));

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) =>{
      return h.file('./VBoardJS/index.html');
    }
  });
  server.route({
    method: 'GET',
    path: '/SwypeApp.js',
    handler: (request, h) =>{
      return h.file('./VBoardJS/SwypeApp.js');
    }
  });

  server.route({
    method: 'GET',
    path: '/{path}/{resource}',
    handler: (request, h) =>{
      return h.file('./VBoardJS/' + request.params.path + '/' + request.params.resource);
    }
  });

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) =>{

  console.log(err);
  process.exit(1);
});

init();