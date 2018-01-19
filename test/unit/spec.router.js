var random = require('random-js')()
var mocks = require('../mocks')

var Router = require('../../dist/riot-view-router')

var SETTINGS = mocks.settings
var STATES = mocks.states

describe('riot-view-router mixin', function() {

  riot = require('riot')

  function bootstrap(settings, states) {
    window = Object.assign({}, mocks.window)
    document = Object.assign({}, mocks.document)
    router = new Router(riot, settings || SETTINGS)
    return router.add(states || STATES).then(() => router)
  }

  it('processes and merges options', function() {
    bootstrap().then((router) => {
      for (var opt in SETTINGS) {
        expect(router.settings[opt]).toBe(SETTINGS[opt])
      }
    })
  })

  it('processes and merges states', function() {
    var router = bootstrap()
    bootstrap().then(router => {
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
  })

  it('splits state routes with variables as intended', function() {
    bootstrap().then(router => {
      var variables = router.states.find(function(state) {
        return state.name === 'profile'
      }).route.variables // # get variables processed by route splitter
      expect(variables.length).toBe(1)
      expect(variables[0].name).toBe('username') // # check name
      expect(variables[0].position).toBe(2) // # check
    })
  })

  it('debugging option is defaulted to false', function() {
    bootstrap({
      default: 'home',
      fallback: '404'
    }, STATES).then((router) => {
      expect(router.settings.debugging).toBe(false)
    })
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
    bootstrap().then(router => {
      expect(router.$logger).toBeDefined()
      expect(router.$logger.$router.settings.debugging).toBeTruthy()
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

})
