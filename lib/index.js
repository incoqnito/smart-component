'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var checkEquality = function checkEquality(a, b, equalityCheck) {
  if (typeof equalityCheck === 'function') {
    return equalityCheck(a, b);
  } else if ((typeof equalityCheck === 'undefined' ? 'undefined' : _typeof(equalityCheck)) === 'object' && equalityCheck !== null) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    return Object.keys(a).reduce(function (result, key) {
      if (checkEquality(a[key], b[key], equalityCheck[key])) {
        return result;
      } else {
        return false;
      }
    }, true);
  } else if (typeof equalityCheck === 'undefined') {
    return a === b;
  } else {
    console.log('Error: Expected a function as an equality check');
  }
};

var SmartComponent = function SmartComponent() {
  var equalityChecks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return function (WrappedComponent) {
    return function (_WrappedComponent) {
      _inherits(SmartComponent, _WrappedComponent);

      function SmartComponent() {
        _classCallCheck(this, SmartComponent);

        return _possibleConstructorReturn(this, (SmartComponent.__proto__ || Object.getPrototypeOf(SmartComponent)).apply(this, arguments));
      }

      _createClass(SmartComponent, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
          var _this2 = this;

          var result = Object.keys(nextProps).filter(function (key) {
            return _this2.props[key] !== nextProps[key];
          }).filter(function (key) {
            if (equalityChecks.hasOwnProperty(key)) {
              return !checkEquality(_this2.props[key], nextProps[key], equalityChecks[key]);
            } else {
              return true;
            }
          });

          return result.length > 0;
        }
      }]);

      return SmartComponent;
    }(WrappedComponent);
  };
};

exports.default = SmartComponent;
