# **riot-view-router**

[![npm](https://img.shields.io/npm/dm/riot-view-router.svg)](https://www.npmjs.com/package/riot-view-router)

[![build](https://travis-ci.org/neetjn/riot-view-router.svg?branch=master)](https://travis-ci.org/neetjn/riot-view-router/)
[![npm version](https://badge.fury.io/js/riot-view-router.svg)](https://badge.fury.io/js/riot-view-router)
[![codecov](https://codecov.io/gh/neetjn/riot-view-router/branch/master/graph/badge.svg)](https://codecov.io/gh/neetjn/riot-view-router)
[![Join the chat at https://gitter.im/riot-view-router/Lobby](https://badges.gitter.im/riot-view-router/Lobby.svg)](https://gitter.im/riot-view-router/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![NPM](https://nodei.co/npm/riot-view-router.png)](https://nodei.co/npm/riot-view-router/)

### About

**riot-view-router** is a lightweight, extensive state based riot.js router for tag views. It was designed after the ui-router project, with all the quirks of riot.js.

This project makes use of the HTML5 history api, using `pushState` under the hood.

### Support

| Chome  | Edge | Firefox | Opera    | Safari |
|--------|------|---------|----------|--------|
| 5.0+ ✔ |  ✔   | 4.0+ ✔  | 11.50+ ✔ | 5.0+ ✔ |

*This project only supports riot.js 3, support for previous versions is not available.*

### Examples

* [riot-todo](https://github.com/neetjn/riot-todo): Todo web app created with riot.js, skeletoncss, animate.css, and foundation-icons. 

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
<script src="https://cdn.jsdelivr.net/npm/riot-view-router/dist/riot-view-router.min.js"></script>
```

**riot-view-router** supports the following settings,

> **`*default`** ; `string` : Default state for router to navigate to on start if route not matched.

> **`debugging`** ; `bool` : Will default to true, spits errors and warnings to console.

> **`href`** ; `string` : Will default to originating location, router will operate off of this.

> **`fragments`** ; `bool` : Will default to true, adds support for fragment identification.

> **`fallback`** ; `string` : Will default to fallback, state to fallback to on mismatch.

> **`title`** ; `string` : Title prefix for routes using a page title.

> **`marker`** ; `string` : Marker for mounting views, default is `r-view`.

```html
<r-view />

or

<div r-view></div>
```

States are composed of the following properties,

> **`*name`** ; `string` : State name.

> **`*route`** ; `string` : Route to match state by.

> **`*tag`** ; `string` : Tag to inject into rout view, mount.

> **`title`** ; `string` : Title suffix for routes.

> **`onEnter(*handler)`** ; `function` : Callback for entering state.

> **`onLeave(*handler)`** ; `function` : Callback for leaving state.

Using the mixin is then as simple as,

```js
import Router from 'riot-view-router'

const router = new Router({
  debugging: true,
  default: 'home',
  fallback: '404',
  href: 'https://mysite.com/blogs'
})

router.add({
  name: '404',
  route: '/notfound',
  tag:'not-found',
  title: '404 Page Not Found',
  onLeave: (state) => {
    console.log('Leaving home')
  }
})

router.add([
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
    name: 'profile',
    route: '/profile/:username',
    tag: 'profile',
    title: '<username>\'s profile'
  }
])

router.on('start', () => {
  console.log('hello world!')
})
```

You may then access the `Router` instance via your tags with `router` like so,

```html
<app>
  <r-view></r-view>

  this.router.start()
</app>
```

To navigate to a route within your riot tags, you may use `r-sref` to reference a state on any element supporting a click event listener. `r-sref` can be used with both complete routes and state names.

```html
<sometag>
  <button r-sref="/profile/{username}">Navigate to profile</button>
  <a r-sref="about">About Page</a>
</sometag>
```

Both route and query string variables can also be accessed directly via the target tag with opts. Take for example navigating to the url `.../!#/profile/john?views=1` with the route pattern `/profile/:username`.

```
<profile>
  <h1>
    User: <small>{this.opts.username}</small>
  </h1>
  <h5>Views: {this.opts.qargs.views}</h5>
</profile>
```

### Router API

The **riot-view-router** has a very simple, easily operable API.

> **`add(*state)`**: Create a new state for the given router instance.

> **`navigate(*route, skipPush)`**: Navigate to a given route.

> **`push(name, opts)`**: Invoke a state change. If arguments arent specified, automatically detect the state and extract opts from the defined state variables.

> **`start()`**: Start router, listen on window hash   changes.

> **`stop()`**: Stop router, related listeners and lifecycle events.

> **`reload()`**: Reload current route.

> **`on(*event, *handler)`**: Register a lifecycle event (start, stop, navigation, push, transition).

### Contributors

* **John Nolette** (john@neetgroup.net)

Contributing guidelines are as follows,

* Any new features must include either a unit test, e2e test, or both.
  * Branches for bugs and features should be structured like so, `issue-x-username`.
* Before putting in a pull request, be sure to verify you've built all your changes.
  
  Travis will build your changes before testing and publishing, but bower pulls from this repository directly.

* Include your name and email in the contributors list.

---
Copyright (c) 2017 John Nolette Licensed under the MIT license.
