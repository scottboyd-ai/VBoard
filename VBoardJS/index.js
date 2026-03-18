'use strict';

const Hapi = require('hapi');
const BKTree = require('./helpers/bktree');
const fs = require('fs');

//Use this server config to host it locally so you can access the project from other devices
const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  routes: {
    cors: true
  }
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
    method: 'GET',
    path: '/analyze',
    handler: async (request, h) =>{
      const letters = request.query && typeof request.query.letters === 'string'
        ? request.query.letters.trim()
        : '';

      if (!letters) {
        return h.response({ error: 'Missing letters payload' }).code(400);
      }

      return tree.query(letters);
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
