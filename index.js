exports.newCrystalConstructor = function () {
  var privateValues = []

  function Crystal() {
    ensurePrivateValues(this);
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

    var ref = ensurePrivateValues(this);

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
    return hasOwnProperty(this, name);
  };

  Crystal.prototype.freeze = function () {
    return Object.freeze(this);
  };

  Crystal.create = function (values) {
    var obj = new Crystal()
    if (typeof values === 'object') {
      obj.define(values);
    }
    return obj;
  };

  function ensurePrivateValues(target) {
    if (typeof target._private_values_ref === 'undefined') {
      var pointer, length

      Object.defineProperty(target, '_private_values_ref', {
        set: function (val) {
          if (pointer) {
            throw new Error("Cannot set private constant reference value.");
          }
          pointer = val;
        },

        get: function () {
          return pointer;
        }
      });

      length = privateValues.push(Object.create(null));
      target._private_values_ref = length - 1;
    }
    return privateValues[target._private_values_ref];
  }

  return Crystal;
};

exports.Crystal = exports.newCrystalConstructor();


function hasOwnProperty(x, prop) {
  return Object.prototype.hasOwnProperty.call(x, prop);
}
