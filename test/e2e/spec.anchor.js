describe('riot-view-router state reference', function() {

    beforeEach(setUp)
    afterEach(tearDown)

    it('should trigger "navigate" as expected', function(done) {
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
        }, router.$constants.intervals.navigate)
      })
    })

  })
