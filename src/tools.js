export class Tools {

  /**
   * Tools for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  constructor (router) {
    this.$router = router
  }

  /**
   * Used to mount state.
   * @param {object} state - State object for mounting.
   * @param {array}
   */
  transition (state, opts) {
    var self = this.$router

    return new Promise((resolve) => {
      if (self.$state) {
        let tag = riot.util.vdom.find((tag) => tag.root.localName == self.$state.tag)
        if (!tag) {
          self.$logger.error('<transition> Could not find a matching tag to unmount')
          reject()
        }
        tag.unmount()
      }
      let node = document.createElement(state.tag)
      self.context.appendChild(node)
      if (opts) {
        let parsed_opts = { }
        opts.forEach((opt) => {
          parsed_opts[opt.name] = opt.value
        }) // # add props
        riot.mount(state.tag, parsed_opts)
        if (state.title) {
          let title = state.title
          opts.forEach((opt) => title = title.replace(`<${opt.name}>`, opt.value))
          document.title = title
        }
      }
      else
        riot.mount(state.tag)
      self._dispatch('transition', { state }).then(resolve).catch(resolve)
    })
  }

}
