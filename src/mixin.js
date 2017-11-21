import { Router } from './core'

export default {

  install(r, options, states) {
    let router = new Router(options, states)
    r.mixin({ $router: router })
    return router
  }

}
