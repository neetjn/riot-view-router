describe('riot-view-router lifecycle event', function() {

  beforeEach(setUp)
  afterEach(tearDown)

  it('handlers should be available once registered', function(done) {
    var check = { count: 0 }
    function handler() { check.count += 1 }
    router.on('navigation', handler).then(() => {
      expect(router.$events.navigation).toBe(handler)
      router.navigate('/about').then(() => {
        expect(check.count).toBe(1)
        done()
      }).catch(failAsyncTest)
    }).catch(failAsyncTest)
  })

})
