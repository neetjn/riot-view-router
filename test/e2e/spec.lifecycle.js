describe('riot-view-router lifecycle events', function() {

  beforeEach(setUp)
  afterEach(tearDown)

  it('handlers should be available once registered', function(done) {
    var check = { count: 0 }
    function handler() { check.count += 1 }
    console.log('ayyy')
    router.on('navigation', handler).then(() => {
      console.log('made it?')
      expect(router.$events.transition).toBe(handler)
      router.navigate('/about').then(() => {
        expect(check.count).toBe(1)
        done()
      }).catch(failAsyncTest)
    }).catch(failAsyncTest)
  })

})
