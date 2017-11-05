describe('riot-view-router', function() {

  failTest = function(error) {
    expect(error).toBeUndefined()
  }

  isLocation = function(location) {
    expect(window.location.hash).toBe(router.$constants.defaults.hash + location)
  }

  isRendered = function(tagName) {
    expect(document.querySelector(router.$constants.defaults.marker + ' ' + tagName)).not.toBeNull()
  }

  beforeEach(function(done) {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    let html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
    riot.mixin('router', new Router(mocks.options, mocks.states))
    router = riot.mixin('router').$router
    router.start().then(done).catch(failTest)
  })

  afterEach(function(done) {
    if (router.running)
      router.stop().then(() => {
        window.history.pushState(null, null, '/')
        done()
      }).catch(failTest)
    else {
      window.history.pushState(null, null, '/')
      done()
    }
  })

  it ('should stop running and clear listeners when stop called', function(done) {
    router.stop().then(() => {
      expect(router.running).toBeFalsy()
      expect(window.onhashchange).toBeUndefined()
      done()
    })
  })

  it('should navigate to default state and render tag on start', function(done) {
    isLocation('/')
    isRendered('home')
    done()
  })

  it('should render tag when navigated to route', function(done) {
    router.navigate('/about').then(() => {
      isLocation('/about')
      isRendered('about')
      done()
    }).catch(failTest)
  })

  describe('given an invalid route', function() {

    it('should navigate to fallback state and render tag on invalid route', function(done) {
      router.navigate('/' + new Date().getTime().toString(16)).then(() => {
        fallbackCheck = setInterval(() => {
          isLocation('/notfound')
          isRendered('not-found')
          window.clearInterval(fallbackCheck)
          done()
        }, router.$constants.intervals.navigate)
      }).catch(failTest)
    })

  })

})
