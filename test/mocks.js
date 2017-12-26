var mocks = {

  /**
   * Options for riot-view-router
   */
  settings: {
    debugging: true,
    default: 'home',
    fallback: '404',
    title: 'Test App'
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
      name: 'time',
      route: '/time',
      tag: 'time',
      title: 'Current Time'
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
      template: '<button r-sref="/profile/view/someguy">someguy\'s profile</button> \
                 <input type="button" r-sref="/profile/view/john%20nolette" value="johns profile" /> \
                 <a r-sref="about">about page</a>'
    },
    {
      name: 'about',
      template: '<h1>about page</h1>'
    },
    {
      name: 'profile',
      template: '<h1>user: <span id="username">{ opts.username }</span></h1> \
                 <h5 @if={opts.qargs}><span id="views">{ opts.qargs.views }</span></h5>'
    },
    {
      name: 'time',
      template: '<h1 id="timestamp">{ new Date().getTime() }</h1>'
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
