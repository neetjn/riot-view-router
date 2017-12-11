describe('riot-view-router state reference', function() {

  beforeEach(setUp)
  afterEach(tearDown)

  it('should bind target elements and redirect to given route', function(done) {
    var called = false
    router.on('navigation', () => {
      called = true
    }).then(() => {
      document.querySelector('button[r-sref]').click()
      var locationCheck = setInterval(() => {
        expect(called).toBeTruthy()
        isLocation('/profile/view/someguy')
        window.clearInterval(locationCheck)
        done()
      }, router.constants.intervals.navigate)
    })
  })

  it('should redirect to given state by name', function(done) {
    document.querySelector('a[r-sref]').click()
    var locationCheck = setInterval(() => {
      isLocation('/about')
      window.clearInterval(locationCheck)
      done()
    }, router.constants.intervals.navigate)
  })

})
