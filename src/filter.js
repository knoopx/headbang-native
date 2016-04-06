require("sugar")

fn = {
  string: function(value) {
    return function(filter) {
      if (!((filter != null ? filter.length : void 0) > 0)) {
        return true;
      }
      return value.toString().toLocaleLowerCase().indexOf(filter.toString().toLocaleLowerCase()) >= 0;
    };
  },
  object: function(value) {
    return function(filter) {
      if (filter == null) {
        return true;
      }
      return Object.keys(filter).all(function(key) {
        return fn.match(value[key])(filter[key]);
      });
    };
  },
  array: function(array) {
    return function(filter) {
      if (filter == null) {
        return true;
      }
      return array.filter(function(value) {
        return fn.match(value)(filter);
      }).count() > 0;
    };
  },
  value: function(value) {
    return function(filter) {
      if (filter == null) {
        return true;
      }
      return value === filter;
    };
  },
  match: function(value) {
    return function(filter) {
      if (filter == null) {
        return true;
      }
      if (Object.isObject(value)) {
        return fn.object(value)(filter);
      } else if (Object.isArray(value)) {
        return fn.array(value)(filter);
      } else if (Object.isString(value)) {
        return fn.string(value)(filter);
      } else {
        return fn.value(value)(filter);
      }
    };
  }
};

module.exports = function(array) {
  return function(filter) {
    if (filter == null) {
      return array;
    }
    return array.filter(function(value) {
      return fn.match(value)(filter);
    });
  };
};
