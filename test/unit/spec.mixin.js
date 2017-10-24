var random = require('random-js')()
var mocks = require('../mocks')

var Router = require('../../dist/riot-view-router')

var OPTIONS = mocks.options
var STATES = mocks.states

describe('riot-view-router', function() {

  describe('registering valid router mixin', function() {

    riot = require('riot')

    function helperGetMixin(options, states) {
      var router = new Router(options || OPTIONS, states || STATES)
      riot.mixin('router', router)
      return riot.mixin('router')
    }

    it('creates property "$router"', function() {
      var mixin = helperGetMixin()
      expect(mixin.$router).not.toBe(undefined)
    })

    it('processes and merges options', function() {
      var mixin = helperGetMixin().$router
      for (var opt in OPTIONS) {
        expect(mixin[opt]).toBe(OPTIONS[opt])
      }
    })

    // it('processes and merges states', function() {
    //   var mixin = helperGetMixin()
    //   expect(mixin.$router.states.length).toBe(STATES.length)
    //   mixin.$router.states.forEach((state) => {
    //     for (var prop in state) {
    //       if (prop !== 'route') {
    //         expect(state[prop]).toBe(STATES[prop])
    //       } // # ensure state value was merged correctly
    //       else {
    //         var route = state[prop]
    //         expect(route.route).toBe(STATE[prop].route)
    //       }
    //     }
    //   })
    // })
    // it('splits routes with variables as intended', function() {
    //   var mixin = helperGetMixin(OPTIONS, STATES.append({
    //     name: 'profile',
    //     route: '/profile/:username',
    //     tag: 'profile'
    //   }))
    //   var states = mixin.$router
    //   var variables = mixin.states.find((state) => {
    //     return state.name == 'profile'
    //   })[0].variables
    //   expect(variables.length).toBe(1)
    //   expect(variables[0].name).toBe('username')
    //   expect(variables[0].position).toBe(2)
    // })
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
    //   var opt = Random.string('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 15)
    //   expect(function() {
    //     helperGetMixin(Object.assign(OPTIONS, {
    //       [opt]: opt
    //     }), STATES)
    //   }).toThrowError(Error)
    // })

  })

})
