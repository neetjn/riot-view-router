describe('riot-view-router', function() {

  failTest = function(error) {
    expect(error).toBeUndefined()
  }

  isLocation = function(location) {
    console.log(window.location)
    expect(window.location.hash).toBe(router.$constants.defaults.hash + location)
  }

  isRendered = function(tagName) {
    expect(document.querySelector(router.$constants.defaults.marker + ' ' + tagName)).toBeDefined()
  }

  beforeEach(function(done) {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    riot.mixin('router', new Router(mocks.options, mocks.states))
    router = riot.mixin('router').$router
    var html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
    router.start().then(done)
  })

  afterEach(function(done) {
    if (router.running)
      router.stop(done)
    else
      done()
  })

  // it ('should stop running and clear listeners when stop called', function(done) {
  //   router.stop().then(() => {
  //     expect(router.running).toBeFalsy()
  //     expect(window.onhashchange).toBeUndefined()
  //     done()
  //   })
  // })

  it('should render tag when navigated to route', function(done) {
    router.navigate('/about').then(() => {
      isLocation('/about')
      isRendered('about')
    }).then(done)
  })

  // describe('given an invalid route', function() {

  //   it('should navigate to fallback state and render tag on invalid route', function(done) {
  //     router.navigate('/' + new Date().getTime().toString(16)).then(() => {
  //       expect(document.querySelector('r-view not-found')).toBeDefined()
  //       done()
  //     })
  //   })

  // })

})
