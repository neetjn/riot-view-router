import random from 'random'
import riot from 'riot'
import { option as OPTIONS, states as STATES } from '../mocks'
import { Router } from '../../dist/riot-view-router'

describe('riot-view-router', function() {
  describe('registering router mixin', function() {

    var Random = random()

    function helperGetMixin(options, states) {
      var router = new Router(options || OPTIONS, states || STATES)
      riot.mixin('router', router)
      return riot.mixin('router')
    }

    it('creates property "$router"', function() {
      let mixin = helperGetMixin()
      expect(mixin).not.toBe(null)
      expect(mixin.$router).not.toBe(undefined)
    })
    it('processes and merges options', function() {
      let mixin = helperGetMixin()
      for (let opt in OPTIONS) {
        expect(riot.mixin[opt]).toBe(OPTIONS[opt])
      }
    })
    it('processes and merges states', function() {
      let mixin = helperGetMixin()
      expect(mixin.$router.states.length).toBe(STATES.length)
      mixin.$router.states.forEach((state) => {
        for (let prop in state) {
          if (prop !== 'route') {
            expect(state[prop]).toBe(STATES[prop])
          } // # ensure state value was merged correctly
        }
        else {
          let route = state[prop]
          expect(route.route).toBe(STATE[prop].route)
        }
      })
    })
    it('splits routes with variables as intended', function() {
      let mixin = helperGetMixin(OPTIONS, STATES.append({
        name: 'profile',
        route: '/profile/:username',
        tag: 'profile'
      ))
      let states = mixin.$router
      let variables = mixin.states.find((state) => {
        return state.name == 'profile'
      })[0].variables
      expect(variables.length).toBe(1)
      expect(variables[0].name).toBe('username')
      expect(variables[0].position).toBe(2)
    })
    it('debugging is defaulted to false', function() {
      let mixin = helperGetMixin({
        defaultState: 'home',
        fallbackState: '404'
      }, STATES)
      expect(mixin.$router.debugging).toBe(false)
    })
    it('default state is enforced', function() {
      expect(function() {
        helperGetMixin({
          debugging: false
        }, STATES)
      }).toThrowError(ReferenceError)
    })
    it('unsupported options should not be processed', function() {
      let opt = Random.string('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)
      expect(function() {
        helperGetMixin(Object.assign(OPTIONS, {
          [opt]: opt
        }), STATES)
      }).toThrowError(Error)
    })

  })
})
