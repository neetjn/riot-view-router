import riot from 'riot'
import { document, window, tags, option, states } from './mocks'
import { Router } from '../../dist/riot-view-router'

describe('riot-view-router', function() {
  describe('registering mixin', function() {

    var router = new Router({
      options, states
    })
    riot.mixin(router)

    it('creates riot property "$router"', function() {

    })
    it('processes and merges options', function() {

    })
    it('processes and merges states', function() {

    })

  })
})
