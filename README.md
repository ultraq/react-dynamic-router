
react-dynamic-router
====================

[![Build Status](https://github.com/ultraq/react-dynamic-router/actions/workflows/build.yml/badge.svg)](https://github.com/ultraq/react-dynamic-router/actions)
[![npm](https://img.shields.io/npm/v/@ultraq/react-dynamic-router.svg?maxAge=3600)](https://www.npmjs.com/package/@ultraq/react-dynamic-router)
[![License](https://img.shields.io/github/license/ultraq/react-dynamic-router.svg?maxAge=2592000)](https://github.com/ultraq/react-dynamic-router/blob/master/LICENSE.txt)

Control the animation to apply to a React route transition.  This component is a
combination router and animation component for dynamic class names based on
which way the user is navigating through your application routes.


Installation
------------

```
npm install @ultraq/react-dynamic-router
```


Usage
-----

`<DynamicRouter>` combines `react-router` with `react-transition-group` to allow
you to add your own clases to page routes for the purpose of performing
animations between one route and another.

Normally with those components you can only specify a single animation class,
applied no matter which 'direction' your users are going through your app.  This
component takes a route class name generator function that, given information
about the to/from routes, can return a different class name, allowing you to
perform reverse animations so that the motions between routes are coherent.

```javascript
import DynamicRouter from '@ultraq/react-dynamic-router';

function generateRouteClassName(nextRoute, lastRoute) {
  if (lastRoute === '/step1' && nextRoute === '/step2') {
  	return 'animate-forward';
  }
  else if (lastRoute === '/step2' && nextRoute === '/step1') {
  	return 'animate-backward';
  }
  return 'animate-forward'; // Some kind of default
}

<DynamicRouter generateRouteClassName={generateRouteClassName}>
  {transitionClassName => (
    <Switch location={location}>
      <Route path="/step1">
        <div className={transitionClassName}>This is step 1</div>
      </Route>
      <Route path="/step2">
        <div className={transitionClassName}>This is step 2</div>
      </Route>
    </Switch>
  )}
</DynamicRouter>
```

### Props
 - **component**: See: https://reactcommunity.org/react-transition-group/transition-group#TransitionGroup-prop-component
 - **generateRouteClassName**: a required function, given the last and next
   routes, expected to return a class name that can be passed down to the child
   function for use.  This value is augmented with react-router's "state"
