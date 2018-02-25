import React from 'react'
import * as R from 'ramda'
import './experiment.css'

const defaultOptions = {
  size: [500, 500],
}

const parseNumberWith = R.ifElse(R.isEmpty, R.always(0))
export const parseNumber = parseNumberWith(Number)
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

// data Control a = Control a { default :: a, parse :: String -> a }
// type Controls = [Control]
export function controlExperiment (doExperiment, controls, maybeOptions) {
  const options = R.merge(defaultOptions, maybeOptions)

  return class Experiment extends React.Component {
    constructor () {
      super();
      this.state = R.map(R.prop('default'), controls)
    }

    updateControl (control) {
      return evt => this.setState({
        // [control]: controls[control].parse(evt.target.value),
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
      return <div>
        <canvas width={options.size[0]} height={options.size[1]} ref={this.renderCanvas.bind(this)} />

        <div className="controls">
          {
            R.keys(controls).map(controlName => {
              const type = controls[controlName].type
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
    }
  }
}
