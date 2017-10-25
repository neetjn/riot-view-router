var random = require('random-js')()
var mocks = require('../mocks')

var Router = require('../../dist/riot-view-router')

var OPTIONS = mocks.options
var STATES = mocks.states

describe('riot-view-router', function() {

  riot = require('riot')

  function helperGetMixin(options, states) {
    var router = new Router(options || OPTIONS, states || STATES)
    riot.mixin('router', router)
    return riot.mixin('router')
  }

  it('creates property "$router"', function() {
    var mixin = helperGetMixin()
    expect(mixin.$router).not.toBeUndefined()
  })

  it('processes and merges options', function() {
    var mixin = helperGetMixin().$router
    for (var opt in OPTIONS) {
      expect(mixin[opt]).toBe(OPTIONS[opt])
    }
  })

  it('processes and merges states', function() {
    var mixin = helperGetMixin().$router
    expect(mixin.states.length).toBe(STATES.length)
    mixin.states.forEach(function(state, index) {
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

  it('splits routes with variables as intended', function() {
    var states = STATES.map(function(state) {
      return Object.assign({}, state)
    }) // # we create a new array of new objects as to not polute our mock global
    var var_state = {
      name: 'profile',
      route: '/profile/view/:username',
      tag: 'profile'
    }
    states.push(var_state)
    var mixin = helperGetMixin(OPTIONS, states).$router
    var variables = mixin.states.find(function(state) {
      return state.name == var_state.name
    }).route.variables // # get variables processed by route splitter
    expect(variables.length).toBe(1)
    expect(variables[0].name).toBe('username') // # check name
    expect(variables[0].position).toBe(2) // # check
  })

  // it('debugging is defaulted to false', function() {
  //   var mixin = helperGetMixin({
  //     defaultState: 'home',
  //     fallbackState: '404'
  //   }, STATES)
  //   expect(mixin.$router.debugging).toBe(false)
  // })
  // it('default state is enforced', function() {
  //   expect(function() {
  //     helperGetMixin({
  //       debugging: false
  //     }, STATES)
  //   }).toThrowError(ReferenceError)
  // })
  // it('unsupported options should not be processed', function() {
  //   var opt = random.string('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 15)
  //   expect(function() {
  //     helperGetMixin(Object.assign(OPTIONS, {
  //       [opt]: opt
  //     }), STATES)
  //   }).toThrowError(Error)
  // })

})
