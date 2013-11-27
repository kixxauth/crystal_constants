function Crystal() {}

Crystal.prototype.define = function (name, value) {
  if (typeof name === 'object') {
    var self = this, values = name
    Object.keys(name).forEach(function (key) {
      self.define(key, values[key]);
    })
    return this;
  }

  function setter() {
    throw new Error("Constant '"+ name +"' is already defined.");
  }

  Object.defineProperty(this, name, {
    value: value
  , enumerable: true
  , writable: false
  , configurable: false
  , set: setter
  });

  return value;
};

Crystal.prototype.isDefined = function (name) {
  var desc
  if (desc = Object.getOwnPropertyDescriptor(this, name)) {
    return desc.writable === false && desc.configurable === false && typeof desc.set === 'function';
  }
  return false;
};

Crystal.create = function (values) {
  values = values || Object.create(null);
};

exports.Crystal = Crystal;