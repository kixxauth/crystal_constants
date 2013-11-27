Crystal Constants
=================

A little JavaScript / CoffeeScript utility class for frozen 'constant' objects.
Crystal Constants works in JavaScript environments with support for
Object.defineProperty and Object.defineProperties, like Node.js and modern browsers.

## Installation
The most common use of Crystal is to use it as a library. In that case, just
include it in your Node.js project by adding a line for Crystal in your
`pacakge.json`. For more information about your `package.json` file, you should
check out the npm documentation by running `npm help json`.

Alternatively, you can quickly install Crystal for use in a project by running

	npm install crystal_constants

which will install crystal_constants in your `node_modules/` folder.

## Example

```JavaScript
// Getting Started
// ===============
var Crystal = require('crystal').Crystal
var CONST = Crystal.create({DAYS_IN_YEAR: 365})

CONST.DAYS_IN_YEAR // 365

try {
  CONST.DAYS_IN_YEAR = 366
} catch (err) {
  // Assignment to a 'constant' property throws an error.
}

// You can assign new constants:
CONST.define('MONTHS_IN_YEAR', 12)

// Your value cannot be re-assigned:
try {
  CONST.MONTHS_IN_YEAR = 11
} catch (err) {
  // Throws an error.
}

// Test if a constant is already defined:
CONST.isDefined('MONTHS_IN_YEAR') // true

// You can assign multiple constants at once:
CONST.define({
  JAN: 31,
, FEB: 28
, MAR: 31
})

// Constants on Existing Objects
// =============================
var define = require('crystal').define

define('COLOR', 'red').on(exports)
exports.COLOR // red

try {
  exports.COLOR = 'blue'
} catch (err) {
  // Throws
}

// Test if already defined:
var isDefined = require('crystal').isDefined

isDefined('COLOR').on(exports) // true

// Define multiple constants at once:
define({HEIGHT: 44, WIDTH: 99}).on(exports)

// Decorate Your Own Prototypes
// ============================
var Crystal = require('crystal').Crystal
var util = require('util')

function Widget(spec) {
  this.define({
    WIDTH: spec.width
  , HEIGHT: spec.height
  })
}

util.inherits(Widget, Crystal)

Widget.prototype.area = function () {
  return this.WIDTH * this.HEIGHT;
}

var rectangle = new Widget({width: 50, height: 100})
rectangle.area() // 5000

try {
  rectangle.HEIGHT = 200
} catch (err) {
  // Throws
}
```

```CoffeeScript
# Or in CoffeeScript, for extra awesome sauce:

class Widget extends Crystal
  constructor: (spec) ->
    @define({
      WIDTH: spec.width
      HEIGHT: spec.height
    })

  area: -> @WIDTH * @HEIGHT

rectangle = new Widget {width: 50, height: 100}
```

## Why?

There isn't really any way to define constants in JavaScript like there are in
other languages. However, we can achieve the same thing in JavaScript with
Object.defineProperty and Object.freeze. However, these techniques have a
major flaw, demonstrated with this Node.js console session:

```
> var x = Object.create(null)
undefined
> x
{}
> Object.defineProperty(x, 'FOO', {value: 99, enumerable: true})
{ FOO: 99 }
> x.FOO
99
> x.FOO = 100
100
> x.FOO
99
> Object.freeze(x)
{ FOO: 99 }
> x.FOO = 100
100
> x.FOO
99
```

Bummer. Instead of throwing an error, V8 (the JavaScript engine in Node.js)
just let us assign values to `x.FOO` even though it had already been defined
and frozen. The value of `x.FOO` didn't change, but V8 didn't tell us that the
assignments failed. That's not very useful if you need constants and expect
them to behave like constants.

## Testing
To run the tests, just do

  ./manage test

You should see the test results output.

Copyright and License
---------------------
Copyright (c) 2013 by Kris Walker <kris@kixx.name> (http://www.kixx.name).

Unless otherwise indicated, all source code is licensed under the MIT license.
See LICENSE for details.
