export const Core = {

  /**
   * Used to navigate with hash pattern.
   * @param (string) route - Route to relocate to.
   */
  navigate (route) {
    self.location = '#!' + route
  },

  /**
   * Used to change states.
   * @param (string) name - Name of state to transition to.
   */
  pushState (name) {
    let state = self.$utils.stateByName(self, name)
    let location = self.location.split('#!')[1]

    if (location !== state.route.route) {
      if (!state.route.variables.length) {
        self.navigate(state.route.route)
        return // # assume function will be retriggered
      }
      else {
        if (self.debugging) {
          console.warn(`State "${name}" does not match current route.`)
          console.warn('Could not re-route due to route variables.')
        }
      }
    }

    if (self.onBeforeStateChange) {
      self.onBeforeStateChange(state)
    }
    if (self.$state && self.$state.onLeave) {
      self.$state.onLeave(state)
    } // # call onLeave, pass old state
    self.transition(state)
    if (self.onStateChange) {
      self.onStateChange(state)
    }
    if (state.onEnter) {
      state.onEnter(state)
    } // # call onEnter, pass new state
    self.$state = state
  },

  /**
   * Used to mount state.
   * @param (object) state - State object for mounting.
   */
  transition (state) {
    let variables = self.$utils.extractRouteVars(self, state)
    if (self.$state) {
      let tag = riot.util.vdom.find((tag) => tag.root.localName == self.$state.tag)
      if (!tag) throw Error('Could not find a matching tag to unmount')
      tag.unmount()
    }
    let node = document.createElement(state.tag)
    let opts = { }
    variables.forEach((variable) => {
      opts[variable.name] = variable.value
    }) // # add props
    self.context.appendChild(node)
    riot.mount(state.tag, opts)
    let title = state.title
    variables.forEach((variable) => title = title.replace(`<${variable.name}>`, variable.value))
    document.title = title
  },

  /**
   * Used to initialize the router and listeners.
   */
  start () {
    console.log(self)
    if (!self.location) {
      window.location.hash = `#!${ self.$utils.stateByName(self, self.defaultState).route.route }`
    } // # route to default state
    self.context_id = '$' + new Date().getTime().toString()
    window[self.context_id] = window.setInterval(function() {
      let context = document.querySelector(self.marker) || document.querySelector(`[${self.marker}]`)
      if (context) {
        self.context = context
        self.pushState(self.$utils.stateByRoute(self).name) // # route to initial state
        window.onhashchange = function() {
          self.pushState(self.$utils.stateByRoute(self).name) // # update state
        } // # create listener for route changes
        window.clearInterval(window[self.context_id])
      }
    }, 250) // # search for view context
  }

}
