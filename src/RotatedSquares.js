import * as R from 'ramda'
import { controlExperiment, parseInteger } from './experiment'

const addVec = R.curry((a, b) => [
  a[0] + b[0],
  a[1] + b[1],
])

// rotates counter clockwise in the cartesian plane
const rotate = theta => ([x, y]) => [
  (x * Math.cos(theta)) - (y * Math.sin(theta)),
  (x * Math.sin(theta)) + (y * Math.cos(theta)),
]

// given a center point and a size, returns a square (an array of four points)
// centered at the given center point
const squareAround = R.curry((center, size) => [
  addVec(center, [size, -size]),
  addVec(center, [size, size]),
  addVec(center, [-size, size]),
  addVec(center, [-size, -size]),
])

export default controlExperiment((canvas, controls) => {
  const ctx = canvas.getContext('2d')

  // config options for the drawing
  const center = [250, 250] // center of all the rects
  const size = 100 // side length of the rect
  const initialRotation = Math.PI / 4
  const count = controls.count
  const max = controls.max
  const initialSquare = squareAround([0, 0], size)
  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'red'

  R.times(n => {
    // rotation of this particular square
    const rotation = initialRotation + ((n / max) * Math.PI * 2)

    // the corners defining this square, centered at the center point
    const square = R.map(
      R.pipe(rotate(rotation), addVec(center)),
      initialSquare
    )

    // move to the top right corner
    ctx.beginPath()
    ctx.moveTo(square[0][0], square[0][1])

    // draw lines between the next three corners
    R.pipe(
      R.drop(1),
      R.forEach(corner => ctx.lineTo(corner[0], corner[1]))
    )(square)

    // draw a line back to the top right corner
    ctx.lineTo(square[0][0], square[0][1])

    // fill the square and draw the border
    ctx.fill()
    ctx.stroke()
  }, count)
}, {
  count: {
    default: 7,
    parse: parseInteger,
    type: 'int',
  },
  max: {
    default: 7,
    parse: parseInteger,
    type: 'int',
  }
}, {
  name: 'RotatedSquares'
})
