failAsyncTest = function(error) {
  expect(error).toBeUndefined()
}

/** Assert current route using router's hash pattern */
isLocation = function(location) {
  expect(window.location.hash).toBe(router.constants.defaults.hash + location)
}

/** Assert element has been rendered from the router's context */
isRendered = function(tagName) {
  expect(document.querySelector(router.constants.defaults.marker + ' ' + tagName)).not.toBeNull()
}
