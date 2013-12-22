var Crystal = require('../index').Crystal
  , util = require('util')

exports['With a new Crystal instance'] = {
  setUp: function (done) {
    this.CONST = Crystal.create({DAYS_IN_YEAR: 365});
    return done();
  },

  "create() defines constants in arguments": function (test) {
    test.strictEqual(this.CONST.DAYS_IN_YEAR, 365);
    return test.done();
  },

  "define() assigns values": function (test) {
    this.CONST.define('foo', 123);
    test.strictEqual(this.CONST.foo, 123);
    return test.done();
  },

  "define() returns the assigned value": function (test) {
    var val = this.CONST.define('foo', 'bar');
    test.strictEqual(val, 'bar');
    return test.done();
  },

  "define() can assign multiple values at once": function (test) {
    this.CONST.define({DAYS_IN_WEEK: 7, WEEKS_IN_YEAR: 52});
    test.strictEqual(this.CONST.DAYS_IN_WEEK, 7);
    test.strictEqual(this.CONST.WEEKS_IN_YEAR, 52);
    return test.done();
  },

  "define()ing defined constants raises an error": function (test) {
    test.expect(1);
    this.CONST.define('foo', 123);

    try {
      this.CONST.define('foo', 456);
    } catch (err) {
      test.equal(err.message, "Property 'foo' is already defined.");
    }

    return test.done();
  },

  "define()ing existing properties raises an error": function (test) {
    test.expect(1);
    this.CONST.foo = 'bar';

    try {
      this.CONST.define('foo', 123);
    } catch (err) {
      test.equal(err.message, "Property 'foo' is already defined.");
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
  },

  "deleting a defined constant is a noop": function (test) {
    this.CONST.define('foo', 'bar');
    test.strictEqual(this.CONST.foo, 'bar');

    delete this.CONST.foo;
    test.strictEqual(this.CONST.foo, 'bar');

    return test.done();
  },

  "isDefined() detects defined constants": function (test) {
    this.CONST.define('foo', 'bar');

    test.ok(this.CONST.isDefined('foo'));
    test.ok(!this.CONST.isDefined('bar'));

    return test.done();
  },

  "isDefined() also detects defined properties": function (test) {
    this.CONST.foo = 'bar';

    test.ok(this.CONST.isDefined('foo'));
    test.ok(!this.CONST.isDefined('bar'));
    
    return test.done();
  },

  "normal object properties may still be set": function (test) {
    this.CONST.foo = 'bar';
    test.equal(this.CONST.foo, 'bar');
    return test.done();
  },

  "normal object properties may still be deleted": function (test) {
    this.CONST.foo = 'bar';
    test.strictEqual(this.CONST.foo, 'bar');

    delete this.CONST.foo;
    test.strictEqual(this.CONST.foo, undefined);
    return test.done();
  },

  "can be frozen with .freeze()": function (test) {
    this.CONST.freeze();
    test.ok(Object.isFrozen(this.CONST));
    return test.done();
  }
};

exports["With a frozen Crystal instance"] = {
  setUp: function (done) {
    this.CONST = Crystal.create();
    this.CONST.foo = 'bar';
    this.CONST.freeze();
    return done();
  },

  "attempting to define a new constant raises an error": function (test) {
    test.expect(1);

    try {
      this.CONST.define('weeksInYear', 52);
    } catch (err) {
      test.equal(err.message, 'Cannot define property:weeksInYear, object is not extensible.');
    }

    return test.done();
  },

  "setting existing properties is a noop": function (test) {
    this.CONST.foo = 'baz';
    test.equal(this.CONST.foo, 'bar');
    return test.done();
  },

  "setting new properties is a noop": function (test) {
    this.CONST.height = 900;
    test.strictEqual(this.CONST.height, undefined);
    return test.done();
  }
};

exports["With a decorated prototype"] = {
  setUp: function (done) {
    function Widget(spec) {
      this.define({
        WIDTH: spec.width
      , HEIGHT: spec.height
      });
    }

    util.inherits(Widget, Crystal);

    Widget.prototype.area = function () {
      return this.WIDTH * this.HEIGHT;
    }

    this.widget = new Widget({width: 99, height: 49});
    return done();
  },

  "can use defined constants": function (test) {
    test.equal(this.widget.area(), 4851);
    test.equal(this.widget.HEIGHT, 49);
    test.equal(this.widget.WIDTH, 99);
    return test.done();
  },

  "define()ing defined constants raises an error": function (test) {
    test.expect(1);

    try {
      this.widget.define('HEIGHT');
    } catch (err) {
      test.equal(err.message, "Property 'HEIGHT' is already defined.");
    }

    return test.done();
  },

  "setting defined constants raises an error": function (test) {
    test.expect(1);

    try {
      this.widget.WIDTH = 9;
    } catch (err) {
      test.equal(err.message, "Constant 'WIDTH' is already defined.");
    }

    return test.done();
  },

  "define()ing existing properties raises an error": function (test) {
    test.expect(1);

    try {
      this.widget.define('area', 123);
    } catch (err) {
      test.equal(err.message, "Property 'area' is already defined.");
    }

    return test.done();
  },

  "isDefined() detects defined constants": function (test) {
    test.ok(this.widget.isDefined('HEIGHT'));
    return test.done();
  },

  "isDefined() also detects defined properties": function (test) {
    test.ok(!this.widget.isDefined('area'));
    return test.done();
  },

  "can be frozen with .freeze()": function (test) {
    this.widget.freeze();
    test.ok(Object.isFrozen(this.widget));
    return test.done();
  }
};

exports["With more than 1 instance of Crystal"] = {
  setUp: function (done) {
    this.instance1 = Crystal.create({HOST: '127.0.0.1'});
    this.instance2 = Crystal.create({PORT: 80});
    return done();
  },

  "constant keys do not collide": function (test) {
    test.equal(this.instance1.HOST, '127.0.0.1');
    test.equal(this.instance2.PORT, 80);

    this.instance1.define('PORT', 8080);
    this.instance2.define('HOST', 'localhost');

    test.equal(this.instance1.HOST, '127.0.0.1');
    test.equal(this.instance2.PORT, 80);
    test.equal(this.instance1.PORT, 8080);
    test.equal(this.instance2.HOST, 'localhost');

    return test.done();
  }

};
