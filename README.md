<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/ymhxqZ47jLBFuVrU2iywqLGC/neetjn/riot-view-router'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/ymhxqZ47jLBFuVrU2iywqLGC/neetjn/riot-view-router.svg' />
</a>

# **riot-view-router**

[![build](https://travis-ci.org/neetjn/riot-view-router.svg?branch=master)](https://travis-ci.org/neetjn/riot-view-router/)
[![npm version](https://badge.fury.io/js/riot-view-router.svg)](https://badge.fury.io/js/riot-view-router)

[![NPM](https://nodei.co/npm/riot-view-router.png)](https://nodei.co/npm/riot-view-router/)

### About

**riot-view-router** is a lightweight, extensive state based riot.js router for tag views. It was designed after the ui-router project, with all the quirks of riot.js.

### Usage

To install via Bower, simply do the following:
```sh
bower install riot-view-router
```
To install via NPM:
```sh
npm install riot-view-router
```
For a quick start using jsdelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/riot-view-router/dist/riot-view-router.js"></script>
```

**riot-view-router** supports the following options,

* `*debugging`: Will default to true, spits errors and warnings to console.
* `*defaultState`: Default state for router to navigate to on start if route not matched.
* `fallbackState`: Will default to fallbackState, state to fallback to on mismatch.
* `onBeforeChange`: Callback for before a state change.
* `onAfterChange`: Callback for after a state change.

States are composed of the following settings,

* `*name`: State name.
* `*route`: Route to match state by.
* `*tag`: Tag to inject into rout view, mount.
* `title`: Title to set window.
* `onEnter`: Callback for entering state.
* `onLeave`: Callback for leaving state.

Using the mixin is then as simple as,

```js
import Router from 'riot-view-router'

const states = [
  {
    name: 'home',
    route: '/',
    tag:'home',
    title: 'Hello World',
    onEnter: (state) => {
      console.log('Entering home')
    }
  },
  {
    name: '404',
    route: '/notfound',
    tag:'not-found',
    title: '404 Page Not Found',
    onLeave: (state) => {
      console.log('Leaving home')
    }
  },
  {
    name: 'profile',
    route: '/profile/:username',
    tag: 'profile',
    title: '<username>\'s profile'
  }
]

riot.mixin(new Router({
  debugging: true,
  defaultState: 'home',
  fallbackState: '404'
}, states))
```

you may then access the `Router` instance via your tags with `$router` like so,

```html
<app>
  <r-view></r-view>

  this.$router.start()
</app>
```

### Router API

The **riot-view-router** has a very simple, easily operable API.

* `pushState(name)`: Invoke a state change.
* `start()`: Start router, listen on window href changes.
* `stop()`: Stop router, related listeners and lifecycle events.


### Contributors

* **John Nolette** (john@neetgroup.net)

Contributing guidelines are as follows,

* Any new features must include either a unit test, e2e test, or both.
* Branches for bugs and features should be structued like so, `issue-x-username`.
* Before putting in a pull request, be sure to verify you've built all your changes.
  
  *Travis will build your changes before testing and publishing, but bower pulls from this repository directly.*

* Include your name and email in the contributors list.

### Support

**riot-view-router** supports riot.js 3, support for previous versions is not available.

---
Copyright (c) 2017 John Nolette Licensed under the MIT license.