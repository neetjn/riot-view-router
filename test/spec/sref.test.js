describe('riot-view-router state reference', function() {

  beforeEach(setUp)
  afterEach(tearDown)

  it('should bind target elements and redirect to given route', function(done) {
    var called = false
    router.on('navigation', () => {
      called = true
    })
    document.querySelector('button[r-sref]').click()
    var locationCheck = setInterval(() => {
      expect(called).toBeTruthy()
      isLocation('/profile/view/someguy')
      window.clearInterval(locationCheck)
      done()
    }, router.constants.intervals.navigate)
  })

  it('should redirect to given state by name', function(done) {
    document.querySelector('a[r-sref]').click()
    var locationCheck = setInterval(() => {
      isLocation('/about')
      window.clearInterval(locationCheck)
      done()
    }, router.constants.intervals.navigate)
  })

  describe('given a route with url encoded variables and query strings', function() {
    it('router should properly decode the data', function(done) {
      document.querySelector('input[r-sref]').click()
      var locationCheck = setInterval(() => {
        isLocation('/profile/view/john%20nolette')
        expect(document.querySelector('#username').innerText).toBe('john nolette')
        window.clearInterval(locationCheck)
        done()
      }, router.constants.intervals.navigate)
    })
  })

})
