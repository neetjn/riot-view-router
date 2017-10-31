import { Router as _Router } from './router'

exports.default = function(options, states) {
  return {
    $router: new _Router(options, states)
  }
}
module.exports = exports['default']
