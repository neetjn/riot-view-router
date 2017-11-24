import { Router } from './core'

export default {

  install(r, options, states) {
    const router = new Router(options, states)
    r.mixin({ router })
    return router
  }

}
