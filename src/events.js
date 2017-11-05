export class Events {

  constructor(router) {
    this.$router = router
  }

  onpushstate(state) {
    let state = self.$utils.stateByRoute()
    let opts = self.$utils.extractRouteVars(state)
    self.push(state.name, opts)
  }

}
