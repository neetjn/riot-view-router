var random = require('random-js')()
var mocks = require('../mocks')

var Router = require('../../dist/riot-view-router')

var OPTIONS = mocks.options
var STATES = mocks.states

describe('riot-view-router mixin', function() {

  riot = require('riot')

  function bootstrap(options, states) {
    window = Object.assign({}, mocks.window)
    document = Object.assign({}, mocks.document)
    return Router.install(riot, options || OPTIONS, states || STATES)
  }

  it('processes and merges options', function() {
    var router = bootstrap()
    for (var opt in OPTIONS) {
      expect(router[opt]).toBe(OPTIONS[opt])
    }
  })

  it('processes and merges states', function() {
    var router = bootstrap()
    expect(router.states.length).toBe(STATES.length)
    router.states.forEach(function(state, index) {
      for (var prop in state) {
        if (prop !== 'route') {
          expect(state[prop]).toBe(STATES[index][prop])
        } // # ensure state value was merged correctly
        else {
          expect(state[prop].route).toBe(STATES[index][prop])
          // # we don't expand our state for a route from STATES because
          // # our route is split in our router constructor
        }
      }
    })
  })

  it('splits state routes with variables as intended', function() {
    var router = bootstrap(OPTIONS, STATES)
    var variables = router.states.find(function(state) {
      return state.name == 'profile'
    }).route.variables // # get variables processed by route splitter
    expect(variables.length).toBe(1)
    expect(variables[0].name).toBe('username') // # check name
    expect(variables[0].position).toBe(2) // # check
  })

  it('debugging option is defaulted to false', function() {
    var router = bootstrap({
      default: 'home',
      fallback: '404'
    }, STATES)
    expect(router.debugging).toBe(false)
  })

  it('default state is enforced', function() {
    expect(function() {
      bootstrap({
        debugging: false
      }, STATES)
    }).toThrowError(ReferenceError)
  })

  it('unsupported options should not be processed', function() {
    var opt = random.string(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    expect(function() {
      var options = Object.assign({}, OPTIONS)
      bootstrap(Object.assign(options, {
        [opt]: opt
      }), STATES)
    }).toThrowError(Error)
  })

  it('logger logstore functions as expected', function() {
    var router = bootstrap()
    expect(router.$logger).toBeDefined()
    expect(router.$logger.$router.debugging).toBeTruthy()
    var message = random.string(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
    var types = {
      log: 'general',
      warn: 'warning',
      error: 'critical'
    } // # map for logs with corresponding type name
    for (type in types) {
      router.$logger[type](message)
      expect(router.$logger.$get(types[type])[0].message).toBe(message)
    }
    expect(router.$logger.$get().length).toBe(3)
  })

})
