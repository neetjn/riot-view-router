var mocks = {

  /**
   * Options for riot-view-router
   */
  options: {
    debugging: true,
    defaultState: 'home',
    fallbackState: '404',
    onBeforeStateChange: function(state) {
      console.warn('about to change states!')
    },
    onStateChange: function(state) {
      console.log('just changed states!')
    }
  },

  /**
   * States for riot-view-router
   */
  states: [
    {
      name: 'home',
      route: '/',
      tag:'home',
      title: 'Hello World'
    },
    {
      name: '404',
      route: '/notfound',
      tag:'not-found',
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
      name: 'not-found',
      template: '<h1>404 not found</h1>'
    }
  ]

}

if (typeof module !== 'undefined')
  module.exports = mocks
