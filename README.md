# hapi-ember

Hapi-ember is a simple Hapi.js plugin to help you route to your [Ember.js](http://www.emberjs.com) application using [Hapi.js](http://www.hapijs.com).

## Installation

Install using NPM:

`npm install hapi-ember`

## Usage

To use hapi-ember, simply register the plugin with your Hapi.js server:

```javascript
var server = new Hapi.Server();

server.connection({port: 1337});

server.register({
    register: require('hapi-ember'),
    options: {
        directory: '/path/to/your/project'
    }}, function(err){
        if(err) throw new Error(err)

        console.log('hapi ember!');
    });
```

## Options

`directory` (required) - The path to your Ember application.

`path` (optional) - The path you would like Hapi to use when routing to your application. _Defaults to "/"_

## Contributing

Pull requests and issues are welcome.
