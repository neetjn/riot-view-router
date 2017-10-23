import riot from 'riot'
import { option as OPTIONS, states as STATES } from '../mocks'
import { Router } from '../../dist/riot-view-router'

describe('riot-view-router', function() {
  describe('registering router mixin', function() {
    
    function helperGetMixin(options, states) {
      var router = new Router({
        options || OPTIONS, states || STATES
      })
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
        expect(riot.mixin)
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
      })
    })
    it('splits routes with variables as intended', function() {
      let mixin = helperGetMixin(OPTIONS, STATES.append({
        name: 'profile',
        route: '/profile/:username',
        tag: 'profile',
        title: '<username>\'s profile'
      ))
      let variables = mixin.$router.routes[mixin.$router.routes.length].variables
      expect(variables.length).toBe(1)
      expect()
    })

  })
})
