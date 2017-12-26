/** Bootstrap functionality for each test case */
function setUp(done) {
  mocks.tags.forEach(function(tag) {
    riot.tag(tag.name, tag.template)
  }) // # create our mock tags
  let html = document.createElement('app')
  document.body.appendChild(html)
  riot.mount('app')
  router = new Router(riot, mocks.settings)
  Promise
    .all(mocks.states.map(state => router.add(state)))
    .then(() => router.start().then(done).catch(failAsyncTest))
}
