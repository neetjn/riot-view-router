import { Router } from './core'

export default {

  install(instance, options, states) {
    const router = new Router(instance, options, states)
    instance.mixin({ router })
    return router
  }

}
