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

  it('should properly update page title', function(done) {
    done()
  })

  describe('given route parameters', function() {

    it('should properly pass route variables as opts', function(done) {
      router.navigate('/profile/view/john').then(() => {
        isLocation('/profile/view/john')
        isRendered('profile')
        expect(document.querySelector('#username').innerText).toBe('john')
        done()
      }).catch(failAsyncTest)
    })

    it('should properly pass route query strings as opts', function(done) {
      router.navigate('/profile/view/john?views=alot').then(() => {
        isLocation('/profile/view/john?views=alot')
        isRendered('profile')
        expect(document.querySelector('#views').innerText).toBe('alot')
        done()
      }).catch(failAsyncTest)
    })

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
