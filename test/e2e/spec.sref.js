describe('riot-view-router state reference', function() {

    beforeEach(setUp)
    afterEach(tearDown)

    it('should bind target elements', function(done) {
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

    it('should properly redirect to state route', function(done) {
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

  })
