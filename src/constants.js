export const Constants = {
  defaults: {
    hash: '#!',
    marker: 'r-view',
    anchorMarker: 'r-sref',
    timeout: 5000
  },
  intervals: {
    start: 10,
    navigate: 50,
    fragments: 250
  },
  options: {
    settings: {
      required: ['default'],
      optional: ['debugging', 'fallback', 'href', 'fragments', 'marker', 'title']
    },
    states: {
      required: ['name', 'route', 'tag'],
      optional: ['title', 'onEnter', 'onLeave']
    }
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
  waits: {
    fragments: 2000
  }
}
