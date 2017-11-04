export class Tools {

  /**
   * Tools for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  constructor(router) {
    this.$router = router
  }

  /**
   * Used to mount state.
   * @param {object} state - State object for mounting.
   */
  transition (state) {
    var self = this.$router

    return new Promise((resolve) => {
      let variables = self.$utils.extractRouteVars(state)
      if (self.$state) {
        let tag = riot.util.vdom.find((tag) => tag.root.localName == self.$state.tag)
        if (!tag)
          throw Error('Could not find a matching tag to unmount')
        tag.unmount()
      }
      let node = document.createElement(state.tag)
      let opts = { }
      variables.forEach((variable) => {
        opts[variable.name] = variable.value
      }) // # add props
      self.context.appendChild(node)
      riot.mount(state.tag, opts)
      if (state.title) {
        let title = state.title
        variables.forEach((variable) => title = title.replace(`<${variable.name}>`, variable.value))
        document.title = title
      }
      resolve()
    })
  }

}
