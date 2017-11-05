(function(history) {
  var pushState = history.pushState
  history.pushState = function(state) {
    if (typeof history.onpushstate == 'function') {
      history.onpushstate({ state: state })
    }
    // ... whatever else you want to do
    // maybe call onhashchange e.handler
    return pushState.apply(history, arguments)
  }
})(window.history)
