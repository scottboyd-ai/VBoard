'use strict';

const Hapi = require('hapi');

// const server = Hapi.server({
//     port: 8080,
//     host: '192.168.1.136'
// });
const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});


const init = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return h.file('./index.html');
        }
    });
    server.route({
        method: 'GET',
        path: '/SwypeApp.js',
        handler: (request, h) => {
            return h.file('./SwypeApp.js');
        }
    });

    server.route({
        method: 'GET',
        path: '/{path}/{resource}',
        handler: (request, h) => {
            return h.file('./' + request.params.path + '/' + request.params.resource);
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();