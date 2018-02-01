# smart-component

A HOC enabling you to easily implement extended property equality checks for your React Components.

## Motivation

### The Problem

When writing components whose performance is crucial (for example top level components or components you render A LOT [something among the lines of > 700 times])
you will often want them to __only update, when their visual appearance will change__.

But how do you do that? Right! Extending from `React.PureComponent` - but wait!
My component is still rerendering, even though the data it receives didn't change?!

This can often be caused by passing objects to your component - be it a JS `Date()`,
an array of entities to render _or even the styles property_. Why?

`React.PureComponent` only does a swallow equality check. This means it does a comparison
using `===` on every key of the old properties and compares it to the value in the new
properties.
However `===` on objects (arrays are also objects in this manner) will only check wether
or not they reference to the same chunk of memory - not if their content is the same.

Don't believe me? Just try `{ key: true } === { key: true }` in your console.
It'll actually return false! And that's exactly what happens, if you use a `PureComponent`
like that:
```js
<MyPureComponent style={{ width: '100%' }} />
```
Rerendering every time its parent rerenders (or more often), because on every parent render
a new object is beeing created (with the same content or key/value pairs but pointing
at a different chunk of memory, so `oldProps.style === newProps.style` will return false) -
resulting in your `PureComponent` thinking it received changed props every time its parent rerenders.

### The Cure

Implementing your own (`shouldComponentUpdate(nextProps)`)[https://reactjs.org/docs/react-component.html#shouldcomponentupdate]
every time!

But this can be quiet time consuming, as you will have to handle every single prop
which might change and cause the need to rerender - who likes writing countless lines
of `if (this.props.key !== nextProps.key) { return true }` _(well in addition to
the props where you need to do deep equality checks or something equal)_?
Of course you can automate that (reducing over the entries of your props), but than
you are in the need of ugly `switch (...) { case ... }` for every prop you want to
treat differently...

#### That's why smart-component is there for you!

__Just give it equality checks for the props you want to treat special (in a very
clean and verbose way) and let it handle the rest using good old `===`!__

## Installation

`
npm install --save @icoqnito.io/smart-component
`

## Usage

index.js
```js
import React from 'react'
import {
  DateDisplay,
  SmartDateDisplay
}

export default class extends React.PureComponent {

  state = {
    date: new Date()
  }

  // this function generates a copy of the current value of this.state.date and sets the state to this copy
  // -> that means that the new value of this.state.date describes the same point in time as the old one
  // however (because new Date() instantiates a new JS Date() object) date === new Date(date) will return false
  // causing a PureComponent to rerender as it only checks using the === operator
  resetDate = () => {
    this.setState({
      date: new Date(this.state.date)
    })
  }

  onStandardRender = () => {
    this.setState((prevState) => ({ standardRenderedCount: prevState.standardRenderedCount + 1 }))
  }

  onSmartRender = () => {
    this.setState((prevState) => ({ smartRenderedCount: prevState.smartRenderedCount + 1 }))
  }

  render () {
    return (
      <div>
        <span>Standard Component rendered {this.state.standardRenderedCount} times<span>
        <DateDisplay date={this.state.date} onRender={this.onStandardRender} />

        <div> &nbsp </div>

        <span>Smart Component rendered {this.state.smartRenderedCount} times<span>
        <SmartDateDisplay date={this.state.date} onRender={this.onSmartRender} />

        <div> &nbsp </div>

        <button type='button' onClick={this.resetDate}>date = new Date(date)</button>
      </div>
    )
  }

}
```

DateDisplay.js
```js
import React from 'react'
import smartComponent from 'smart-component'

export class DateDisplay extends React.PureComponent {

  render () {
    this.props.onRender && this.props.onRender()

    return (
      <div>{ props.date }</div>
    )
  }

}

export const SmartDateDisplay = smartComponent({
  date: (a, b) => a.getTime() === b.getTime()   // comparison function to compare the values of props.date at two different points in time; true -> equal
  // getTime() returns the timestamp as a number, making you able to compare them for equality just like normal numbers
}, DateAndMiscDisplay)
```

You will see the standard component calling its onRender every time you click the button - opposing to the Smart Component,
which uses its custom equality check implemented by __you__ to prevent useless rerenders.
