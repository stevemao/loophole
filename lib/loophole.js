(function() {
  var vm,
    __slice = [].slice;

  vm = require('vm');

  exports.allowUnsafeEval = function(fn) {
    var previousEval;
    previousEval = global["eval"];
    try {
      global["eval"] = function(source) {
        return vm.runInThisContext(source);
      };
      return fn();
    } finally {
      global["eval"] = previousEval;
    }
  };

  exports.allowUnsafeNewFunction = function(fn) {
    var previousFunction;
    previousFunction = global.Function;
    try {
      global.Function = exports.Function;
      return fn();
    } finally {
      global.Function = previousFunction;
    }
  };

  exports.allowUnsafeEvalAsync = function(fn) {
    var callback, e, previousEval;
    previousEval = global["eval"];
    try {
      global["eval"] = function(source) {
        return vm.runInThisContext(source);
      };
      callback = function() {
        return global["eval"] = previousEval;
      };
      return fn(callback);
    } catch (_error) {
      e = _error;
      return global["eval"] = previousEval;
    }
  };

  exports.allowUnsafeNewFunctionAsync = function(fn) {
    var callback, e, previousFunction;
    previousFunction = global.Function;
    try {
      global.Function = exports.Function;
      callback = function() {
        return global["eval"] = previousFunction;
      };
      return fn(callback);
    } catch (_error) {
      e = _error;
      return global.Function = previousFunction;
    }
  };

  exports.Function = function() {
    var body, paramList, paramLists, params, _i, _j, _len;
    paramLists = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), body = arguments[_i++];
    params = [];
    for (_j = 0, _len = paramLists.length; _j < _len; _j++) {
      paramList = paramLists[_j];
      if (typeof paramList === 'string') {
        paramList = paramList.split(/\s*,\s*/);
      }
      params.push.apply(params, paramList);
    }
    return vm.runInThisContext("(function(" + (params.join(', ')) + ") {\n  " + body + "\n})");
  };

  exports.Function.prototype = global.Function.prototype;

}).call(this);
