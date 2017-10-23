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
    title: 'Hello World'
  },
  {
  	name: '404',
    route: '/notfound',
    tag:'not-found',
    title: '404 Page Not Found'
  }
]
