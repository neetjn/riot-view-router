/** Bootstrap functionality for each test case */
function setUp(done) {
  mocks.tags.forEach(function(tag) {
    riot.tag(tag.name, tag.template)
  }) // # create our mock tags
  let html = document.createElement('app')
  document.body.appendChild(html)
  riot.mount('app')
  router = new Router(riot, mocks.settings)
  console.log(mocks.states)
  router.add(mocks.states)
    .then(() => router.start().then(done))
    .catch(failAsyncTest)
}
