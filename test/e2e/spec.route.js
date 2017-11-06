describe('riot-view-router', function() {

  beforeEach(setUp)
  afterEach(tearDown)

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
    }).catch(failAsyncTest)
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
      }).catch(failAsyncTest)
    })

  })

})
