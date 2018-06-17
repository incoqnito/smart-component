const checkEquality = (a, b, props, nextProps, equalityCheck) => {
  if (typeof equalityCheck === 'function') {
    return equalityCheck(a, b, props, nextProps)
  } else if (typeof equalityCheck === 'object' && equalityCheck !== null) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false
    }

    return Object.keys(a).reduce((result, key) => {
      if (checkEquality(a[key], b[key], props, nextProps, equalityCheck[key])) {
        return result
      } else {
        return false
      }
    }, true)
  } else if (typeof equalityCheck === 'undefined') {
    return a === b
  } else {
    console.log('Error: Expected a function as an equality check')
  }
}

const SmartComponent = (equalityChecks = {}) => (WrappedComponent) => {
  return class SmartComponent extends WrappedComponent {
    shouldComponentUpdate (nextProps, nextState) {

      const superShouldComponentUpdate = super.shouldComponentUpdate && !super.shouldComponentUpdate(nextProps, nextState)
      if(superShouldComponentUpdate) {
        return false
      }

      const result = Object.keys(nextProps)
        .filter((key) => this.props[key] !== nextProps[key])
        .filter((key) => {
          if (equalityChecks.hasOwnProperty(key)) {
            return !checkEquality(this.props[key], nextProps[key], this.props, nextProps, equalityChecks[key])
          } else {
            return true
          }
        })

      return result.length > 0 || this.state !== nextState
    }
  }
}

export default SmartComponent
