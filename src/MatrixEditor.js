import React from 'react'
import PropTypes from 'prop-types'

import * as R from 'ramda'

import './MatrixEditor.css'

const emptyMatrix = size => R.times(() => Array(size).fill(undefined), size)
const padMatrix = R.curry((size, value) => R.times(
  row => R.times(
    col => value[row].length < size
      ? undefined
      : R.defaultTo(0, value[row][col]),
    size
  ),
  size
))
const cropMatrix = R.curry((size, matrix) => R.pipe(
  R.take(size),
  R.map(R.take(size))
)(matrix))

export default class MatrixEditor extends React.Component {
  render () {
    // const value = cropMatrix(
    //   this.props.size,
    //   padMatrix(this.props.size, this.props.value)
    // ) || emptyMatrix(this.props.size)
    const matrix = R.ifElse(
      R.complement(Boolean),
      () => emptyMatrix(this.props.size),
      R.pipe(padMatrix(this.props.size), cropMatrix(this.props.size))
    )(this.props.value)

    return (
      <div className="matrix-editor">
        <div>
          {
            R.take(this.props.size, matrix).map((row, rowIndex) => (
              <div className="matrix-row" style={{ display: 'flex' }}>
                {
                  R.take(this.props.size, row).map((value, colIndex) => (
                    <Cell
                      size={this.props.size}
                      position={[ rowIndex, colIndex ]}
                      value={value}
                      onChange={value => this.props.onChange(value, [ rowIndex, colIndex ], matrix)}
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
MatrixEditor.propTypes = {
  // Only square matrices can be edited
  size: PropTypes.number.isRequired,

  // The value is not required.
  // A matrix of 0s is rendered if no value is provided.
  // If the value has dimensions that don't match the size,
  // then 0s are used to pad the missing values.
  // If the value is larger than the size, it is simply cropped.
  value: PropTypes.arrayOf(PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  )),

  // onChange(newValue, [ row, column ], previousMatrix)
  onChange: PropTypes.func.isRequired,

  // optional prop that, if specified, allows the size of the matrix to be changed
  onChangeSize: PropTypes.func,
}

// .control-input {
//   padding: 3px 5px;
//   border-radius: 2px 2px 0 2px;
//   border: 1px solid #AAAAAA;
// }
const cellStyle = {
  padding: '3px 5px',
  borderRadius: '2px 2px 0 2px',
  border: '1px solid #AAAAAA',
  textAlign: 'center',
}
const Cell = ({ width = 2, value = 0, onChange, size, position }) => {
  return <div style={{ padding: '3px' }}>
    <input
      type="text"
      value={value}
      onChange={evt => onChange(evt.target.value)}
      style={{ ...cellStyle, width: `${width}rem` }} />
  </div>
}
Cell.propTypes = {
  width: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
}

