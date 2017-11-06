var mocks = {

  /**
   * Options for riot-view-router
   */
  options: {
    debugging: true,
    defaultState: 'home',
    fallbackState: '404',
  },

  /**
   * States for riot-view-router
   */
  states: [
    {
      name: 'home',
      route: '/',
      tag: 'home',
      title: 'Hello World'
    },
    {
      name: 'about',
      route: '/about',
      tag: 'about',
      title: 'About'
    },
    {
      name: 'profile',
      route: '/profile/view/:username',
      tag: 'profile',
      title: '<username>\'s profile page'
    },
    {
      name: '404',
      route: '/notfound',
      tag: 'not-found',
      title: '404 Page Not Found'
    }
  ],

  /**
   * Tags for riot-view-router
   */
  tags: [
    {
      name: 'app',
      template: '<r-view></r-view>'
    },
    {
      name: 'home',
      template: '<h1>home page</h1>'
    },
    {
      name: 'about',
      template: '<h1>about page</h1>'
    },
    {
      name: 'profile',
      template: '<h1>user: <span id="username">{ opts.username }</span></h1>'
    },
    {
      name: 'not-found',
      template: '<h1>404 not found</h1>'
    }
  ],

  /**
   * Window context for riot-view-router
   */
  window: {
    location: {
      href: 'http://google.com',
      hash: ''
    }
  },

  /**
   * Document context for riot-view-router
   */
  document: { }

}

if (typeof module !== 'undefined')
  module.exports = mocks
