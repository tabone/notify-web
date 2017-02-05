/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app')

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  })

  // Material Design Lite
  app.import('bower_components/material-design-lite/material.min.js')
  app.import('vendor/material-design-lite/style.css')
  app.import('vendor/material-design-lite/icons.css')
  app.import('vendor/fonts/roboto.css')

  // Markdown & Syntax Highlighter
  app.import('bower_components/marked/marked.min.js')
  app.import('bower_components/highlightjs/highlight.pack.min.js')
  app.import('bower_components/highlightjs/styles/monokai-sublime.css')

  // Dialog Polyfill
  app.import('bower_components/dialog-polyfill/dialog-polyfill.js')
  app.import('bower_components/dialog-polyfill/dialog-polyfill.css')

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree()
}
