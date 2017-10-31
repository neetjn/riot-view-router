import { Router as _Router } from './router'

export default function(options, states) {
  return {
    $router: new _Router(options, states)
  }
}
