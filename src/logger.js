export class Logger {

  /**
   * Logging interface for the riot-view-router mixin.
   * @param {Router} router - Router for utilities to reference
   */
  constructor (router) {
    this.$router = router
    this.logs = []

    Object.defineProperty(this.$router, 'time', {
      get: function() {
        return new Date().getTime()
      }
    })
  }

  /**
   * Format log for logstore
   * @param {string} message - message to log.
   * @param {int} time - timestamp for log.
   */
  _format(message, time) {
    return `[${new Date(time).toString()}]: (riot-view-router) "${message}"`
  }

  /**
   * Fetch logs, allows for filtering by type.
   * @param {string} type - Log type to filter by.
   * @returns {Array}
   */
  $get (type) {
    return this.logs.filter((log) => type ? log.type == type : true)
  }

  /**
   * Pushes provided message to log store.
   * @param {string} message - Message to log.
   */
  log (message) {
    let time = self.time
    if (this.$router.debugging)
      console.log(this._format(message, time))
    this.logs.push({ type: 'general', message, time })
  }

  /**
   * Pushes provided message to log store.
   * @param {string} message - Message to log.
   */
  warn (message) {
    let time = self.time
    if (this.$router.debugging)
      console.warn(this._format(message, time))
    this.logs.push({ type: 'warning', message, time })
  }

  /**
   * Pushes provided message to log store.
   * @param {string} message - Message to log.
   */
  error (message) {
    let time = self.time
    if (this.$router.debugging)
      console.error(this._format(message, time))
    this.logs.push({ type: 'critical', message, time })
  }

}
