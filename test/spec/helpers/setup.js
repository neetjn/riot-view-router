/** Bootstrap functionality for each test case */
function setUp(done) {
  MOCK.tags.forEach(function(tag) {
    riot.tag(tag.name, tag.template)
  }) // # create our mock tags
  let html = document.createElement('app')
  document.body.appendChild(html)
  riot.mount('app')
  router = new Router(riot, MOCK.settings)
  router.add(MOCK.states)
    .then(() => router.start().then(done))
    .catch(failAsyncTest)
}
