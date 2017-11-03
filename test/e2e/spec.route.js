describe('riot-view-router', function() {

  beforeEach(function() {
    mocks.tags.forEach(function(tag) {
      riot.tag(tag.name, tag.template)
    }) // # create our mock tags
    riot.mixin('router', new Router(mocks.options, mocks.states))
    router = riot.mixin('router').$router
    var html = document.createElement('app')
    document.body.appendChild(html)
    riot.mount('app')
  })

  // it('should not start until called', function() {
  //   expect(document.querySelector('app r-view').firstChild).toBeNull()
  // })

  // it('should instantiate property "$router"', function() {
  //   expect(router).toBeDefined()
  // })

  // it('should navigate to default state and render tag on start', function() {
  //   router.start()
  //   expect(window.location.hash).toBe(router.$constants.defaults.hash + '/')
  //   expect(document.querySelector('r-view home')).toBeDefined()
  // })

  it('should render tag when navigated to route', function() {
    router.start()

    setTimeout(function() {
      expect(document.querySelector('r-view not-found'))
      window.location = `/${router.$constants.defaults.hash}/about`
      done()
    }, 1500)
    //expect(document.querySelector('r-view abofut')).not.toBeNull()
  })

  // describe('given an invalid route', function() {

  //   it('should navigate to fallback state and render tag on invalid route', function() {
  //     router.start()
  //     window.location.hash = `${router.$constants.defaults.hash}/${new Date().getTime().toString(16)}`
  //     console.log(document.body.innerHTML)
  //     expect(window.location.hash).toBe(router.$constants.defaults.hash + '/about')
  //     expect(document.querySelector('r-view not-found')).toBeDefined()
  //   })

  // })

})
