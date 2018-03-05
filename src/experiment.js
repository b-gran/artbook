import React from 'react'
import * as R from 'ramda'

import MatrixEditor from './MatrixEditor'

import './experiment.css'
import { updateMatrix } from './matrix'

const defaultOptions = {
  size: [500, 500],
}

const _windowParseFloat = window.parseFloat

// Parse numbers encoded as strings.
// The empty string is always considered to be 0.
const parseNumberWith = R.ifElse(R.isEmpty, R.always(0))
export const parseFloat = parseNumberWith(_windowParseFloat)
export const parseInteger = parseNumberWith(number => parseInt(number, 10))

export default function (doExperiment, maybeOptions) {
  const options = R.merge(defaultOptions, maybeOptions)

  return class Experiment extends React.Component {
    renderCanvas (canvas) {
      if (!canvas) return;
      doExperiment(canvas)
    }

    render () {
      return <div>
        <canvas width={options.size[0]} height={options.size[1]} ref={this.renderCanvas} />
      </div>
    }
  }
}

// Save control values (as an object of { [controlName]: controlValue })
// to local storage, keyed by the experiment name.
const saveControls = R.curry((experimentName, controlValue) => {
  const serializedControls = JSON.stringify(controlValue)
  window.localStorage.setItem(experimentName, serializedControls)
})

// Load control values (keyed by experiment name) from local storage.
const loadControls = R.when(
  R.complement(R.isNil),
  R.pipe(window.localStorage.getItem.bind(window.localStorage), JSON.parse)
)

// data Control a = Control a { default :: a, parse :: String -> a }
// type Controls = [Control]
export function controlExperiment (doExperiment, controls, maybeOptions) {
  const options = R.merge(defaultOptions, maybeOptions)
  const defaults = R.map(R.prop('default'), controls)

  // Load the initial controls from localStorage (if we have an experiment name).
  // Otherwise use the defaults passed to this function.
  const initialControlValues = options.name
    ? R.pick(R.keys(controls), R.merge(defaults, loadControls(options.name)))
    : defaults

  if (options.name) {
    saveControls(options.name, initialControlValues)
  }

  return class Experiment extends React.Component {
    constructor () {
      super()
      this.state = initialControlValues
    }

    componentDidUpdate () {
      if (options.name) {
        saveControls(options.name, this.state)
      }
    }

    updateControl (control) {
      return evt => this.setState({
        [control]: evt.target.value,
      })
    }

    renderCanvas (canvas) {
      if (!canvas) return;
      canvas.getContext('2d').clearRect(0, 0, options.size[0], options.size[1])
      doExperiment(
        canvas,
        R.mapObjIndexed(
          (value, control) => controls[control].parse(value),
          this.state
        )
      )
    }

    render () {
      return (<div className="wrap">
        <div className="control-wrap">
          <canvas width={options.size[0]} height={options.size[1]} ref={this.renderCanvas.bind(this)} />

          <div className="controls">
            {
              R.keys(controls).map(controlName => {
                const type = controls[controlName].type

                if (type === 'matrix') {
                  return (
                    <div className="control">
                      <span className="control-name">{controlName}</span>
                      <MatrixEditor value={this.state[controlName]} size={3} onChange={(value, position, matrix) => this.setState({
                        [controlName]: updateMatrix(position, value, matrix),
                      })} />
                    </div>
                  )
                }

                return (
                  <div className="control">
                    <span className="control-name">{controlName}</span>
                    <div className="control-input-wrap">
                      <input className="control-input" type="text" value={this.state[controlName]}
                             onChange={this.updateControl.call(this, controlName)}/>

                      {
                        type && <div className="type-hint">{ type }</div>
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>)
    }
  }
}
