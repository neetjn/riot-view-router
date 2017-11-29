export const Constants = {
  defaults: {
    hash: '#!',
    marker: 'r-view',
    anchorMarker: 'r-sref',
    timeout: 5000
  },
  regex: {
    settings: {
      default: /[a-zA-Z0-9]/g,
      fallback: /[a-zA-Z0-9]/g,
      href: /(www|http:|https:)+[^\s]+[\w]/g,
      marker: /[a-zA-Z\-]*/g
    },
    state: {
      name: /[a-zA-Z0-9]/g,
      route: /^\/(?::?[a-zA-Z0-9]+\/?)*$/g
    },
    misc: {
      routeVariable: /(:(?!qargs)[a-zA-Z]*)/g
    }
  },
  intervals: {
    start: 10,
    navigate: 50,
    fragments: 250
  },
  events: {
    supported: ['start', 'stop', 'reload', 'navigation', 'push', 'transition'],
    delay: 0
  }
}
