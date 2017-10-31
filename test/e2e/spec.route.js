describe('riot-view-router', function() {

  beforeEach(function() {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    riot.mixin('router', new Router(mocks.options, mocks.states))
    var html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
  })

  it('should not start until called', function() {
    expect(document.querySelector('app r-view')).toBeDefined()
  })

  it('should instantiate property "$router"', function() {
    riot.mixin('router').$router
  })

  it('should navigate to default state on start', function() {
    riot.mixin('router').$router.start()
    expect(document.querySelector('home')).toBeDefined()
  })

})
