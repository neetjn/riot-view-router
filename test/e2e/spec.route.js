describe('riot-view-router', function() {

  failTest = function(error) {
    expect(error).toBeUndefined()
  }

  isLocation = function(location) {
    expect(window.location.hash).toBe(router.$constants.defaults.hash + location)
  }

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
    expect(document.querySelector('app r-view').firstChild).toBeNull()
    expect(router.running).toBeFalsy()
  })

  it('should instantiate property "$router"', function() {
    expect(router).toBeDefined()
  })

  it('should navigate to default state and render tag on start', function(done) {
    router.start().then(function() {
      isLocation('/')
      expect(document.querySelector('r-view home')).toBeDefined()
      router.stop().then(done)
    }).catch(failTest)
  })

  it('should render tag when navigated to route', function(done) {
    router.start().then(function() {
      router.navigate('/about').then(() => {
        isLocation('/about')
        expect(document.querySelector('r-view about')).toBeDefined()
        router.stop().then(done)
      })
    }).catch(failTest)
  })

  // describe('given an invalid route', function() {

  //   it('should navigate to fallback state and render tag on invalid route', function() {
  //     router.start()
  //     window.location.hash = `${router.$constants.defaults.hash}/${new Date().getTime().toString(16)}`
  //     console.log(document.body.innerHTML)
  //     expect(window.location.hash).toBe(router.$constants.defaults.hash + '/about')
  //     expect(document.querySelector('r-view not-found')).toBeDefined()
  //   })

  // })

})
