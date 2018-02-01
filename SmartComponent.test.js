import SmartComponent from './SmartComponent'

describe('SmartComponent', () => {
  it('inhertis the wrapped component', () => {
    class Test {}
    const ReturnedComponent = SmartComponent()(Test)

    expect(ReturnedComponent.prototype).toBeInstanceOf(Test)
  })

  it('implements shouldComponentUpdate', () => {
    class Test {}
    const ReturnedComponent = SmartComponent()(Test)

    expect(ReturnedComponent.prototype).toHaveProperty('shouldComponentUpdate', expect.any(Function))
  })

  describe('shouldComponentUpdate', () => {
    it('returns false if all equality checks pass', () => {
      class Test {
        props = {
          someProperty: true
        }
      }

      const ReturnedComponent = new (SmartComponent()(Test))()

      expect(ReturnedComponent.shouldComponentUpdate({
        someProperty: true
      })).toBe(false)
    })

    it('returns true if there are properties differing', () => {
      class Test {
        props = {
          someProperty: true
        }
      }

      const ReturnedComponent = new (SmartComponent()(Test))()

      expect(ReturnedComponent.shouldComponentUpdate({
        someProperty: false
      })).toBe(true)
    })

    it('calls the given equality check functions with the previous and the next value of their respective property', () => {
      const oldProps = {
        someProperty: true
      }
      const newProps = {
        someProperty: false
      }

      class Test {
        props = oldProps
      }

      const checkSomeProperty = jest.fn()
        .mockReturnValue(false)
      const ReturnedComponent = new (SmartComponent({
        someProperty: checkSomeProperty
      })(Test))()

      expect(ReturnedComponent.shouldComponentUpdate(newProps)).toBe(true)
      expect(checkSomeProperty).toHaveBeenCalledWith(oldProps.someProperty, newProps.someProperty)
    })

    it('checks with === before calling the equality check', () => {
      const oldProps = {
        someProperty: true
      }
      const newProps = {
        someProperty: oldProps.someProperty
      }

      class Test {
        props = oldProps
      }

      const checkSomeProperty = jest.fn()
        .mockReturnValue(false)
      const ReturnedComponent = new (SmartComponent({
        someProperty: checkSomeProperty
      })(Test))()

      expect(ReturnedComponent.shouldComponentUpdate(newProps)).toBe(false)
      expect(checkSomeProperty).not.toHaveBeenCalled()
    })

    it('returns true when at least one of the equality checks fails', () => {
      const oldProps = {}
      const newProps = {}
      const equalityChecks = {}
      for (let i = 0; i < 100; i++) {
        oldProps[i.toString()] = 0
        newProps[i.toString()] = 1
        equalityChecks[i.toString()] = () => true
      }

      equalityChecks['50'] = () => false

      class Test {
        props = oldProps
      }

      const ReturnedComponent = new (SmartComponent(equalityChecks)(Test))()

      expect(ReturnedComponent.shouldComponentUpdate(newProps)).toBe(true)
    })

    it('returns false if all equality checks return true', () => {
      const oldProps = {}
      const newProps = {}
      const equalityChecks = {}
      for (let i = 0; i < 100; i++) {
        oldProps[i.toString()] = Math.round(Math.random())
        newProps[i.toString()] = Math.round(Math.random())
        equalityChecks[i.toString()] = () => true
      }

      class Test {
        props = oldProps
      }

      const ReturnedComponent = new (SmartComponent(equalityChecks)(Test))()

      expect(ReturnedComponent.shouldComponentUpdate(newProps)).toBe(false)
    })

    it('calls nested equality checks and testes the other keys using ===', () => {
      const myObject = {
        a: 3,
        b: 4
      }

      const oldProps = {
        someObject: {
          someNestedObject: {
            someProp: false,
            otherProp: true,
            objProp: myObject
          }
        }
      }

      const newProps = {
        someObject: {
          someNestedObject: {
            someProp: true,
            otherProp: true,
            objProp: myObject
          }
        }
      }

      const result = true
      const equalityCheckFunction = jest.fn()
        .mockReturnValue(result)

      const equalityChecks = {
        someObject: {
          someNestedObject: {
            someProp: equalityCheckFunction
          }
        }
      }

      class Test {
        props = oldProps
      }

      const ReturnedComponent = new (SmartComponent(equalityChecks)(Test))()

      expect(ReturnedComponent.shouldComponentUpdate(newProps)).toBe(!result)
      expect(equalityCheckFunction).toHaveBeenCalledWith(
        oldProps.someObject.someNestedObject.someProp,
        newProps.someObject.someNestedObject.someProp
      )
    })
  })
})
