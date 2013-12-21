var Crystal = require('../index').Crystal
  , define = require('../index').define
  , isDefined = require('../index').isDefined

exports['When creating a new constant object'] = {
  setUp: function (done) {
    this.CONST = Crystal.create();
    return done();
  },

  "define() assigns values": function (test) {
    this.CONST.define('foo', 123);
    test.strictEqual(this.CONST.foo, 123);
    return test.done();
  },

  "defining defined properties raises an error": function (test) {
    test.expect(1);

    try {
      this.CONST.define('define', 123);
    } catch (err) {
      test.equal(err.message, "Property 'define' is already defined.");
    }

    return test.done();
  },

  "defining defined constants raises an error": function (test) {
    test.expect(1);
    this.CONST.define('x', 123);

    try {
      this.CONST.define('x', 456);
    } catch (err) {
      test.equal(err.message, "Property 'x' is already defined.");
    }

    return test.done();
  },

  "setting defined constants raises an error": function (test) {
    test.expect(1);
    this.CONST.define('x', 123);

    try {
      this.CONST.x = 456;
    } catch (err) {
      test.equal(err.message, "Constant 'x' is already defined.");
    }

    return test.done();
  }
};