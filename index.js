exports.newCrystalConstructor = function () {
  var privateValues = []

  function Crystal() {
    var length = privateValues.push(Object.create(null));
    this._private_values_ref = length - 1;
  }

  Crystal.prototype.define = function (name, value) {
    if (typeof name === 'object') {
      var self = this, values = name
      Object.keys(name).forEach(function (key) {
        self.define(key, values[key]);
      })
      return this;
    }

    if (typeof this[name] !== 'undefined') {
      throw new Error("Property '"+ name +"' is already defined.")
    }

    var ref = privateValues[this._private_values_ref]

    function setter(val) {
      if (hasOwnProperty(ref, name)) {
        throw new Error("Constant '"+ name +"' is already defined.");
      }
      ref[name] = val;
    }

    Object.defineProperty(this, name, {
      enumerable: true
    , configurable: false
    , set: setter
    , get: function () { return ref[name]; }
    });

    return this[name] = value;
  };

  Crystal.prototype.isDefined = function (name) {
    var ref = privateValues[this._private_values_ref]
    return hasOwnProperty(ref, name);
  };

  Crystal.create = function (values) {
    var obj = new Crystal()
    if (typeof values === 'object') {
      obj.define(values);
    }
    return obj;
  };

  return Crystal;
};

exports.Crystal = exports.newCrystalConstructor();


exports.define = (function () {
  function makeCrystal(args) {
    var self = Object.create(null)

    self.on = function (target) {
      return Crystal.prototype.define.apply(target, args);
    };

    return self;
  }

  function define() {
    return makeCrystal(arguments);
  }

  return define;
}());


exports.isDefined = (function () {
  function makeCrystal(args) {
    var self = Object.create(null)

    self.on = function (target) {
      return Crystal.prototype.isDefined.apply(target, args);
    };

    return self;
  }

  function isDefined() {
    return makeCrystal(arguments);
  }

  return isDefined;
}());

function hasOwnProperty(x, prop) {
  return Object.prototype.hasOwnProperty.call(x, prop);
}
