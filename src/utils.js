export class Utils {

  /**
   * Utilities for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  constructor(router) {
    this.$router = router
  }

  /**
   * Used to search for states by their name.
   * @param {string} name - Name of state to search for.
   */
  stateByName (name) {
    var self = this.$router
    return self.states.find((state) => name == state.name)
  }

  /**
   * Used for extracting route patterns.
   * @param {string} route - Route from state.
   */
  splitRoute(route) {
    var self = this.$router

    if (!route.match(self.$constants.regex.routeFormat))
      throw Error(`Route "${route}" did not match expected route format`)

    let pattern = route.split('/').slice(1)
    let variables = pattern.filter((item) => {
      return item.match(self.$constants.regex.routeVariable)
    }).map((item) => {
      return {
        name: item.split('').slice(1).join(''),
        position: pattern.indexOf(item)
      }
    })
    variables.forEach((item) => {
      if (variables.filter((_item) => _item == item).length > 1)
        throw Error(`Found duplicate route variable pattern\n\t "${route}"`)
    })
    return {
      route,
      pattern,
      variables
    }
  }

  /**
   * Used to search for a state by your current route.
   */
  stateByRoute() {
    var self = this.$router

    let stubs = self.location.hash.split(self.$constants.defaults.hash)
    if (stubs.length == 2)
      stubs = stubs[1].split('/').slice(1)
    else
      stubs = ['/']

    let state = self.states.find((state) => {
      let route = state.route
      if (stubs.length == route.pattern.length) {
        for (let stub in stubs) {
          if (stubs[stub] !== route.pattern[stub] && route.pattern[stub] !== '*') {
            if (!route.variables.find((variable) => variable.position == stub)) {
              return false
            }
          }
        }
        return true
      }
    })

    if (!state) {
      self.$logger.warn('Route was not matched, defaulting to fallback state')
      return this.stateByName(self.fallbackState)
    }

    return state
  }

  /**
   * Used to extract route variables.
   * @param {object} state - State object for variable matching.
   */
  extractRouteVars(state) {
    var self = this.$router

    let stubs = self.location.hash.split(self.$constants.defaults.hash)
    if (stubs.length == 2)
      stubs = stubs[1].split('/').slice(1)
    else
      stubs = ['/']

    let variables = state.route.variables
    variables.forEach((variable) => {
      variable.value = stubs[variable.position]
    })

    let query = self.location.hash.split('?') ?
    if (query.length == 2) {
      query = query[1]
      variables._query = {}
      query.split('&').forEach((fragment) => {
        console.log(fragment)
        fragment.split('=').forEach((pair) => {
          variables._query[pair[0]] = pair[1]
        })
      })
    }

    return variables
  }

}
