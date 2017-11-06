export const Constants = {
  defaults: {
    hash: '#!',
    marker: 'r-view',
    anchorMarker: 'r-sref',
    timeout: 5000
  },
  regex: {
    marker: /[a-zA-Z\-]*/g,
    stateName: /[a-zA-Z0-9]/g,
    routeFormat: /^\/(?::?[a-zA-Z0-9]+\/?)*$/g,
    routeVariable: /(:[a-zA-Z]*)/g
  },
  intervals: {
    start: 10,
    navigate: 50
  },
  events: {
    supported: ['start', 'stop', 'navigation', 'push', 'transition'],
    delay: 0
  }
}
