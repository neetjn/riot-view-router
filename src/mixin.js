import { Router as _Router } from './router'

export const Router = function(options, states) {
  return {
    $router: new _Router(options, states)
  }
}
