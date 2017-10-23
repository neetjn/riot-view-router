export var window = {
  $timeouts: 0,
  setInterval(func, timeout) {
    return $timeouts += 1
  },
  clearInterval(func, timeout) {
    return true
  },
  location: {
    hash: ''
  }
}

/**
 * Document mockup
 */
export var document = {
  querySelector() {

  }
}

/**
 *
 */
export var tags = [

]

/**
 * Options for riot-view-router
 */
export var options = {
  debugging: true,
  defaultState: 'home',
  fallbackState: '404',
  onBeforeStateChange(state) {
    console.warn('about to change states!')
  },
  onStateChange(state) {
    console.log('just changed states!')
  }
}

/**
 * States for riot-view-router
 */
export var states = [
  {
  	name: 'home',
    route: '/',
    tag:'home',
    title: 'Hello World',
    onEnter: function(state) {
    	console.log(`transitioning to home from ${state.name}`)
    }
  },
  {
  	name: '404',
    route: '/notfound',
    tag:'not-found',
    title: '404 Page Not Found'
  },
  {
  	name: 'profile',
    route: '/profile/:username',
    tag: 'profile',
    title: '<username>\'s profile'
  }
]
