'use strict';

var Boom = require('boom'),
    mimes = require('mime-types'),
    assign = require('lodash.assign'),
    inert = require('inert'),
    hapiEmber = {},
    internals = {};

/**
 * Default options object
 * path - Path for Hapi to listen on
 * directory - The directory for frontend application
 * routeHash - Hash used to force redirect to Ember route
 */
internals.options = {
    path: '/{param*}',
    directory: '/',
    routeHash: '#'
};

/**
 * Handles all responses that our directory route
 * does not handle.
 * @param  {*} request The request Object
 * @param  {*} reply   The reply interface
 * @return {*}         reply
 */
internals.responseHandler =  function responseHandler(request, reply){
    var response = request.response,
        path = request.url.path;

    if(!response.isBoom){
        return reply(response);
    }

    if(mimes.lookup(path)){
        return reply(Boom.notFound('file not found'));
    }else{
        return internals.replyEmberRoute(path, reply);
    }
};

/**
 * Redirects request to an Ember route.
 * @param  {String} path  The Ember route path.
 * @param  {Object|Function} reply The reply object from the request.
 * @return {Function}       Reply to the request.
 */
internals.replyEmberRoute = function replyEmberRoute(path, reply){
    return reply.redirect('/' + this.options.routeHash + path);
};

/**
 * Override default options Object with provided
 * options Object.
 * @param {Object} options Provided options Object.
 */
internals.setOptions = function setOptions(options){
    this.options = assign(this.options, options);
};


hapiEmber.register = function register(server, options, next){
    internals.setOptions(options);

    //Register with inert
    server.register(inert, function(){
        //Define the server route
        server.route({
            method: 'GET',
            path: internals.options.path,
            handler: {
                directory: {
                    path: internals.options.directory,
                    index: true,
                    listing: false
                }
            }
        });

        //Handle anything not found in the default path
        server.ext('onPreResponse', internals.responseHandler);

        next();
    });
};

hapiEmber.register.attributes = {
    pkg: require('../package.json')
};

module.exports = hapiEmber;
