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
        const tag = riot.util.vdom.find((tag) => tag.root.localName == self.$state.tag)
        if (!tag) {
          self.$logger.error('(transition) Could not find a matching tag to unmount')
          reject()
        }
        tag.unmount()
      }
      const node = document.createElement(state.tag)
      self.context.appendChild(node)
      if (opts) {
        const parsed_opts = { }
        opts.forEach((opt) => {
          parsed_opts[opt.name] = opt.value
        }) // # add props
        parsed_opts.qargs = opts._query
        riot.mount(state.tag, parsed_opts)
        if (state.title) {
          let title = self.titleRoot ? `${self.titleRoot} - ${state.title}` : state.title
          opts.forEach((opt) => title = title.replace(`<${opt.name}>`, opt.value))
          document.title = title
        }
      }
      else
        riot.mount(state.tag)

      document.querySelectorAll(`[${self.$constants.defaults.anchorMarker}]`).forEach((el) => {
        el.onclick = function () {
          self.navigate(el.getAttribute(self.$constants.defaults.anchorMarker))
        }
      })

      self._dispatch('transition', { state }).then(resolve).catch(resolve)
    })
  }

}
