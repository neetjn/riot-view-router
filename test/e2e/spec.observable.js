describe('riot-view-router observable', function() {
  it('core methods are triggered as intended when referenced', function() {
    let event = ''
    router
      .on('navigate', () => event = 'navigate')
      .on('push', () => event = 'push')
      .on('start', () => event = 'start')
      .on('stop', () => event = 'stop')
      .on('reload', () => event = 'reload')
  })
})
