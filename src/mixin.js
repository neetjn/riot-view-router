import { Router as _Router } from './router'

const Router = function(options, states) {
  return {
    $router: new _Router(options, states)
  }
}

exports.Router = Router
module.exports = Router
