export const Core = {

  /**
   * Used to navigate with hash pattern.
   * @param (string) route - Route to relocate to.
   */
  navigate (route) {
    this.$router.location = '#!' + route
  },

  /**
   * Used to change states.
   * @param (string) name - Name of state to transition to.
   */
  pushState (name) {
    let state = this.$router.$utils.stateByName(name)
    let location = this.$router.location.split('#!')[1]

    if (location !== state.route.route) {
      if (!state.route.variables.length) {
        this.$router.navigate(state.route.route)
        return // # assume function will be retriggered
      }
      else {
        if (this.$router.debugging) {
          console.warn(`State "${name}" does not match current route.`)
          console.warn('Could not re-route due to route variables.')
        }
      }
    }

    if (this.$router.onBeforeStateChange) {
      this.$router.onBeforeStateChange(state)
    }
    if (this.$router.$state && this.$router.$state.onLeave) {
      this.$router.$state.onLeave(state)
    } // # call onLeave, pass old state
    this.$router.transition(state)
    if (this.$router.onStateChange) {
      this.$router.onStateChange(state)
    }
    if (state.onEnter) {
      state.onEnter(state)
    } // # call onEnter, pass new state
    this.$router.$state = state
  },

  /**
   * Used to mount state.
   * @param (object) state - State object for mounting.
   */
  transition (state) {
    let variables = this.$router.$utils.extractRouteVars(state)
    if (this.$router.$state) {
      let tag = riot.util.vdom.find((tag) => tag.root.localName == this.$router.$state.tag)
      if (!tag) throw Error('Could not find a matching tag to unmount')
      tag.unmount()
    }
    let node = document.createElement(state.tag)
    let opts = { }
    variables.forEach((variable) => {
      opts[variable.name] = variable.value
    }) // # add props
    this.$router.context.appendChild(node)
    riot.mount(state.tag, opts)
    let title = state.title
    variables.forEach((variable) => title = title.replace(`<${variable.name}>`, variable.value))
    document.title = title
  },

  /**
   * Used to initialize the router and listeners.
   */
  start () {
    console.log(this.$router)
    if (!this.$router.location) {
      window.location.hash = `#!${ this.$router.$utils.stateByName(this.$router.defaultState).route.route }`
    } // # route to default state
    this.$router.context_id = '$' + new Date().getTime().toString()
    window[this.$router.context_id] = window.setInterval(function() {
      let context = document.querySelector(this.$router.marker) || document.querySelector(`[${this.$router.marker}]`)
      if (context) {
        this.$router.context = context
        this.$router.pushState(this.$router.$utils.stateByRoute().name) // # route to initial state
        window.onhashchange = function() {
          this.$router.pushState(this.$router.$utils.stateByRoute().name) // # update state
        } // # create listener for route changes
        window.clearInterval(window[this.$router.context_id])
      }
    }, 250) // # search for view context
  }

}
