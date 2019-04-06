'use strict';

const Hapi = require('hapi');
const BKTree = require('./helpers/bktree');
const fs = require('fs');

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

  let terms = await JSON.parse(fs.readFileSync('./VBoardJS/dict/20k.json', 'utf8'));
  let tree = new BKTree(terms);
  const charactersHelper = require('./helpers/charactersHelper');

  await server.register(require('inert'));

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) =>{
      return h.file('./VBoardJS/index.html');
    }
  });

  server.route({
    method: 'POST',
    path: '/analyze',
    handler: async (request, h) =>{
      return await tree.query(JSON.parse(request.payload).letters);
    }
  });

  server.route({
    method: 'GET',
    path: '/characters',
    handler: async (request, h) =>{
      return await charactersHelper.getCharacters(request.query.test);
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