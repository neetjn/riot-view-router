import { Router as _Router } from './router'

export const Router = function(options, states) {
  this.$router = new _Router(options, states)
}
