import { Router } from './core'

export default {

  install(_riot, options, states) {
    const router = new Router(_riot, options, states)
    _riot.mixin({ router })
    return router
  }

}
