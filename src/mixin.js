import './polyfills/onpushstate'
import { Router as _Router } from './core'

export default function(options, states) {
  return {
    $router: new _Router(options, states)
  }
}
