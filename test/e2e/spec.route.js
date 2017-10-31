describe('riot-view-router', function() {

  beforeEach(function() {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    riot.mixin(new Router(mocks.options, mocks.states))
    var html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
  })

  it('should mount the tag', function() {

  })

})
