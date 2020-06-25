import React from 'react'

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

const defaultOptions = {
  withRef: false
}

const SmartComponent = (equalityChecks = {}, options = {}) => (WrappedComponent) => {
  options = {
    ...defaultOptions,
    ...options
  }

  class SmartComponent extends React.Component {
    constructor (props) {
      super(props)

      if (options.withRef) {
        this.wrappedInstanceRef = React.createRef()
      }
    }

    getWrappedInstance = () => {
      if (!this.wrappedInstanceRef) {
        throw new Error('Please set withRef to true if you want to access the wrapped component instance.')
      }

      return this.wrappedInstanceRef.current
    }

    shouldComponentUpdate (nextProps, nextState) {
      const result = Object.keys(nextProps)
        .filter((key) => key !== 'innerRef' && this.props[key] !== nextProps[key])
        .filter((key) => {
          if (equalityChecks.hasOwnProperty(key)) {
            return !checkEquality(this.props[key], nextProps[key], this.props, nextProps, equalityChecks[key])
          } else {
            return true
          }
        })

      return result.length > 0 || this.state !== nextState
    }

    render () {
      return <WrappedComponent {...this.props} ref={this.wrappedInstanceRef} />
    }
  }

  return SmartComponent
}

export default SmartComponent
