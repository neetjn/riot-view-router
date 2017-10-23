import riot from 'riot'
import { document, window, tags, option, states } from '../mocks'
import { Router } from '../../dist/riot-view-router'

describe('riot-view-router', function() {
  describe('registering malformed router mixin', () {

  })
  describe('registering router mixin', function() {

    var router = new Router({
      options, states
    })
    riot.mixin('router', router)

    it('creates property "$router"', function() {
      let mixin = riot.mixin('router')
      expect(mixin).not.toBe(null)
      expect(mixin.$router).not.toBe(undefined)
    })
    it('processes and merges options', function() {

    })
    it('processes and merges states', function() {
      expect(mixin.$router.states.length).toBe(states.length)
      mixin.$router.states.forEach((state) => {
        state.
      })
    })

  })
})
