describe('riot-view-router observable', function() {

  beforeEach(setUp)
  afterEach(tearDown)

  it('core methods are triggered as intended when referenced', function(done) {
    let event = ''
    let transitioned = false
    router
      .on('navigate', () => { event = 'navigate' })
      .on('push', () => { event = 'push' })
      .on('transition', () => { transitioned = true })
      .on('start', () => { event = 'start' })
      .on('stop', () => { event = 'stop' })
      .on('reload', () => { event = 'reload' })

    router.navigate('/about', true).then(() => {
      expect(event).toBe('navigate')
      router.navigate('/about').then(() => {
      expect(event).toBe('push')
      expect(transitioned).toBeTruthy()
      router.reload().then(() => {
      expect(event).toBe('reload')
        router.stop().then(() => {
        expect(event).toBe('stop')
          router.start().then(() => {
          expect(event).toBe('start')
          done()})})})
    })})
  })
})
