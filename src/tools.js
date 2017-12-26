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
    const self = this.$router

    return new Promise((resolve) => {
      if (self.$state) {
        const removable = riot.util.vdom.find((tag) => tag.root.localName == self.$state.tag)
        if (!removable) {
          self.$logger.error('(transition) Could not find a matching tag to unmount')
          reject()
        }
        removable.unmount()
      }
      const node = document.createElement(state.tag)
      self.context.appendChild(node)

      if (opts) {
        const parsed_opts = { }
        opts.forEach((opt) => {
          parsed_opts[opt.name] = opt.value
        }) // # add props
        parsed_opts.qargs = opts._query
        var tag = self.$riot.mount(state.tag, parsed_opts)
        if (state.title) {
          let title = self.settings.title ? `${self.settings.title} - ${state.title}` : state.title
          opts.forEach((opt) => title = title.replace(`<${opt.name}>`, opt.value))
          document.title = title
        }
        else if (self.settings.title)
          document.title = self.settings.title
      }
      else
        var tag = self.$riot.mount(state.tag)

      tag[0].on('updated', () => {
        if (self.running) {
          document.querySelectorAll(`[${self.constants.defaults.anchorMarker}]`).forEach((el) => {
            el.onclick = function () {
              const sref = el.getAttribute(self.constants.defaults.anchorMarker)
              if (self.$utils.stateByName(sref)) {
                const state = self.$utils.stateByName(sref)
                if (!state.route.variables.length) {
                  self.navigate(state.route.route)
                } else {
                  self.$logger.error('(transition) Could not navigate to state due to expected route variables.')
                }
              } else {
                self.navigate(sref)
              }
            }
          })
        }
      }) // # observable for binding sref occurrences
      tag[0].trigger('updated') // # trigger sref binding

      if (self.settings.fragments) {
        const fragment = self.location.hash.split(self.constants.defaults.hash).join('').split('#')
        if (fragment.length === 2) {
          let attempts = 0
          const search = setInterval(() => {
            attempts += 1
            if (document.querySelector(`#${fragment[1]}`)) {
              document.querySelector(`#${fragment[1]}`).scrollIntoView()
              self._dispatch('transition', { state }).then(resolve).catch(resolve)
              clearInterval(search)
            } else if (attempts * self.constants.intervals.fragments >= self.constants.waits.fragments) {
              self.$logger.error(`(transition) Fragment identifier "#${fragment[1]}" not found.`)
              self._dispatch('transition', { state }).then(resolve).catch(resolve)
              clearInterval(search)
            }
          }, self.constants.intervals.fragments)
        }
      } else
        self._dispatch('transition', { state }).then(resolve).catch(resolve)
    })
  }

}
