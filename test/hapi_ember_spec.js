'use strict';

var Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.describe,
    it = lab.it,
    expect = require('expect'),
    Hapi = require('hapi');

describe('hapi-ember', function(){
    it('should register as a hapi plugin', function(done){
        var server = new Hapi.Server();
        server.connection({port: 3000});
        server.register({
            register: require('../index.js')}, function(err){
            expect(err).toNotExist();
            done();
        });
    });

    it('should have a route handler', function(done){
        var server = new Hapi.Server();
        server.connection({port: 3000});
        server.register({
            register: require('../index.js')}, function(err){
                expect(err).toNotExist();

                var table = server.table();

                table[0].table.filter(function(route){
                    expect(route.settings.handler).toBeAn(Function);
                });

                done();
        });
    });

    it('should use provided path parameter option', function(done){
        var server = new Hapi.Server();
        var options = {
            path: '/api/{param*}'
        };

        server.connection({port: 3000});
        server.register({
            register: require('../index.js'),
            options: options}, function(err){
                expect(err).toNotExist();

                var table = server.table();

                table[0].table.filter(function(route){
                    expect(route.path).toEqual(options.path);
                });

                done();
        });
    });

    it('should return a 404 for invalid file requests', function(done){
        var server = new Hapi.Server();
        var options = {
            path: '/{param*}',
            directory: './test/helpers'
        };

        server.connection({port: 3000});
        server.register({
            register: require('../index.js'),
            options: options}, function(err){
                expect(err).toNotExist();
                server.inject('index.jpg', function(res){
                    expect(res.statusCode).toEqual(404);
                    done();
                });
        });
    });

    it('should redirect to index file', function(done){
        var server = new Hapi.Server();
        var options = {
            directory: './test/helpers'
        };

        server.connection({port: 3000});
        server.register({
            register: require('../index.js'),
            options: options}, function(err){
                expect(err).toNotExist();

                server.inject('/', function(res){
                    expect(res.statusCode).toEqual(200);
                    done();
                });
        });
    });

    it('should read file from directory', function(done){
        var server = new Hapi.Server();
        var options = {
            directory: './test/helpers'
        };

        server.connection({port: 3000});
        server.register({
            register: require('../index.js'),
            options: options}, function(err){
                expect(err).toNotExist();

                server.inject('/index.html', function(res){
                    expect(res.statusCode).toEqual(200);
                    done();
                });
        });
    });

    it('should redirect to ember route', function(done){
        var server = new Hapi.Server();
        var options = {
            directory: './test/helpers'
        };

        server.connection({port: 3000});
        server.register({
            register: require('../index.js'),
            options: options}, function(err){
                expect(err).toNotExist();

                server.inject('/register?user=test', function(res){
                    expect(res.statusCode).toEqual(302);
                    expect(res.headers.location).toEqual('/#/register?user=test');
                    done();
                });
        });
    });
});
