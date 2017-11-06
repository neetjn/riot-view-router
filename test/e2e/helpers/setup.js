/** Bootstrap functionality for each test case */
function setUp(done) {
  mocks.tags.forEach(function(tag) {
    riot.tag(tag.name, tag.template)
  }) // # create our mock tags
  let html = document.createElement('app')
  document.body.appendChild(html)
  riot.mount('app')
  riot.mixin('router', new Router(mocks.options, mocks.states))
  router = riot.mixin('router').$router
  router.start().then(done).catch(failAsyncTest)
}
