import Package from '../package.json'

export const Constants = {
  defaults: {
    hash: '#!',
    marker: 'r-view',
    anchorMarker: 'r-sref'
  },
  regex: {
    marker: /[a-zA-Z\-]*/g,
    stateName: /[a-zA-Z0-9]/g,
    routeFormat: /^\/(?::?[a-zA-Z0-9]+\/?)*$/g,
    routeVariable: /(:[a-zA-Z]*)/g
  },
  version: Package.version
}
