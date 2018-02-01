const checkEquality = (a, b, equalityCheck) => {
  if (typeof equalityCheck === 'function') {
    return equalityCheck(a, b)
  } else if (typeof equalityCheck === 'object' && equalityCheck !== null) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false
    }

    return Object.keys(a).reduce((result, key) => {
      if (checkEquality(a[key], b[key], equalityCheck[key])) {
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

const SmartComponent = (equalityChecks = {}) => (WrappedComponent) => class SmartComponent extends WrappedComponent {
  shouldComponentUpdate (nextProps) {
    const result = Object.keys(nextProps)
      .filter((key) => this.props[key] !== nextProps[key])
      .filter((key) => {
        if (equalityChecks.hasOwnProperty(key)) {
          return !checkEquality(this.props[key], nextProps[key], equalityChecks[key])
        } else {
          return true
        }
      })

    return result.length > 0
  }
}

export default SmartComponent
