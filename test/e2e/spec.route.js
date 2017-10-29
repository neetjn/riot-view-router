var Router = require('../../dist/riot-view-router')

var mocks = require('../mocks.js')
var OPTIONS = mocks.options
var STATES = mocks.states

describe('riot-view-router', function() {

  beforeEach(function() {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    riot.mixin(new Router(OPTIONS, STATES))
    var html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
  })

  it('should mount the tag', function() {

  })

})
