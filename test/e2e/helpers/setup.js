/** Bootstrap functionality for each test case */
function setUp(done) {
  mocks.tags.forEach(function(tag) {
    riot.tag(tag.name, tag.template)
  }) // # create our mock tags
  let html = document.createElement('app')
  document.body.appendChild(html)
  riot.mount('app')
  router = Router.install(riot, mocks.settings, mocks.states)
  router.start().then(done).catch(failAsyncTest)
}
