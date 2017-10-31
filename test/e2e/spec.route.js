describe('riot-view-router', function() {

  beforeEach(function() {
    // mocks.tags.forEach(function(tag) {
    //   riot.tag(tag.name, tag.template)
    // }) // # create our mock tags
    //riot.mixin(new Router(OPTIONS, STATES))
    var html = document.createElement('app')
    document.body.appendChild(html)
    //riot.mount('app')
    var router = new Router({

    }, [{}])
  })

  it('should mount the tag', function() {

  })

})
