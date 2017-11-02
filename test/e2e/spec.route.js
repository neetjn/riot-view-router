describe('riot-view-router', function() {

  beforeEach(function() {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    riot.mixin('router', new Router(mocks.options, mocks.states))
    router = riot.mixin('router').$router
    var html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
  })

  it('should not start until called', function() {
    expect(document.querySelector('app r-view').firstChild).toBeUndefined()
  })

  it('should instantiate property "$router"', function() {
    expect(router).toBeDefined()
  })

  it('should navigate to default state and render tag on start', function() {
    router.start()
    expect(window.location.hash).toBe(router.$constants.default.hash + '/')
    expect(document.querySelector('r-view home')).toBeDefined()
  })

  it('should render tag when navigated to route', function() {
    router.start()
    window.location.hash = router.$constants.default.hash + 'about'
    expect(document.querySelector('r-view about')).toBeDefined()
  })

  it('should navigate to fallback state and render tag on invalid route', function() {
    router.start()
    window.location.hash = router.$constants.default.hash + new Date().getTime().toString(16)
    expect(window.location.hash).toBe(router.$constants.default.hash + '/notFound')
    expect(document.querySelector('r-view not-found')).toBeDefined()
  })

})
