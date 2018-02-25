import * as R from 'ramda'
import { controlExperiment, parseInteger } from './experiment'
import { getPermutation, toHexString } from './util'
import { convolveWith } from './matrix'

const kident = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
]

const kedge = [
  [1, 0, -1],
  [0, 0, 0],
  [-1, 0, 1],
]

const kedge2 = [
  [-1, -1, -1],
  [-1,  8, -1],
  [-1, -1, -1],
]

const kblur = [
  [1/9, 1/9, 1/9],
  [1/9, 1/9, 1/9],
  [1/9, 1/9, 1/9],
]

// returns a function capable of generating perlin noise in three dimensions
function perlin (repeat = -1) {
  const permutation = getPermutation()
  const p = R.times(n => permutation[n % 256], 512)
  
  return R.curry((x, y, z) => {
    if (repeat > 0) {									// If we have any repeat on, change the coordinates to their "local" repetitions
      x = x % repeat
      y = y % repeat
      z = z % repeat
    }

    const xi = (x|0) & 255								// Calculate the "unit cube" that the point asked will be located in
    const yi = (y|0) & 255								// The left bound is ( |_x_|,|_y_|,|_z_| ) and the right bound is that
    const zi = (z|0) & 255								// plus 1.  Next we calculate the location (from 0.0 to 1.0) in that cube.

    const xf = x - (x|0)
    const yf = y - (y|0)
    const zf = z - (z|0)

    const u = fade(xf)
    const v = fade(yf)
    const w = fade(zf)

    const aaa = p[p[p[    xi ] +     yi ] +     zi ]
    const aba = p[p[p[    xi ] + inc(yi)] +     zi ]
    const aab = p[p[p[    xi ] +     yi ] + inc(zi)]
    const abb = p[p[p[    xi ] + inc(yi)] + inc(zi)]
    const baa = p[p[p[inc(xi)] +     yi ] +     zi ]
    const bba = p[p[p[inc(xi)] + inc(yi)] +     zi ]
    const bab = p[p[p[inc(xi)] +     yi ] + inc(zi)]
    const bbb = p[p[p[inc(xi)] + inc(yi)] + inc(zi)]

    // The gradient function calculates the dot product between a pseudorandom
    // gradient vector and the vector from the input coordinate to the 8
    // surrounding points in its unit cube.
    let x1 = lerp(
      grad(aaa, xf    , yf, zf),
      grad(baa, xf - 1, yf, zf),
      u
    )

    // This is all then lerped together as a sort of weighted average based on the faded (u,v,w)
    // values we made earlier.
    let x2 = lerp(
      grad(aba, xf    , yf - 1, zf),
      grad(bba, xf - 1, yf - 1, zf),
      u
    )
    const y1 = lerp(x1, x2, v)

    x1 = lerp(
      grad(aab, xf    , yf, zf - 1),
      grad(bab, xf - 1, yf, zf - 1),
      u
    )
    x2 = lerp(
      grad(abb, xf    , yf - 1, zf - 1),
      grad(bbb, xf - 1, yf - 1, zf - 1),
      u
    )
    const y2 = lerp(x1, x2, v)

    return (lerp(y1, y2, w) + 1) / 2
  })

  // Just increments a number, wrapping around if repeat is specified
  function inc (n) {
    const incremented = n + 1
    return repeat > 0
      ? incremented % repeat
      : incremented
  }

  function grad (hash, x, y, z) {
    switch ((hash|0) & 0xF) {
      case 0x0: return  x + y
      case 0x1: return -x + y
      case 0x2: return  x - y
      case 0x3: return -x - y
      case 0x4: return  x + z
      case 0x5: return -x + z
      case 0x6: return  x - z
      case 0x7: return -x - z
      case 0x8: return  y + z
      case 0x9: return -y + z
      case 0xA: return  y - z
      case 0xB: return -y - z
      case 0xC: return  y + x
      case 0xD: return -y + z
      case 0xE: return  y - x
      case 0xF: return -y - z

      default: return 0 // never happens
    }
  }

  // easing function
  function fade (t) {
    // return t * t * t * (t * (t * 6 - 15) + 10)
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  // linearly interpolate between two points
  function lerp (a, b, x) {
    return a + x * (b - a)
  }
}

export default controlExperiment(
  (canvas, controls) => {
    const ctx = canvas.getContext('2d')
    const size = [300, 300]
    const cells = [controls.columns, controls.rows]
    const cellSizes = [size[0] / cells[0], size[1] / cells[1]]

    const image = R.times(
      () => Array(size[1]).fill(0),
      size[0]
    )

    const P = perlin()

    for (let x = 0; x < size[0]; x++) {
      for (let y = 0; y < size[1]; y++) {
        const opacity = P(x / cellSizes[0], y / cellSizes[1], 0)
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`
        ctx.fillRect(x, y + size[1], 1, 1)

        // image[y][x] = (0xFFFFFF * opacity)|0

        const v = ((0xFF * opacity) ^ 0xFF)|0
        image[y][x] = v

        // const valueHexString = toHexString(v)
        // image[y][x] = parseInt(`${valueHexString}${valueHexString}${valueHexString}`, 16)
        // image[y][x] = `#${valueHexString}${valueHexString}${valueHexString}`
      }
    }

    convolveWith(R.clamp(0, 255), kblur, image)
    convolveWith(R.clamp(0, 255), kedge2, image)

    image.forEach(
      (row, rowIndex) => row.forEach(
        (pixel, colIndex) => {
          // ctx.fillStyle = `#${pixel.toString(16)}`
          const pixelHexString = toHexString(pixel|0)
          ctx.fillStyle = `#${pixelHexString}${pixelHexString}${pixelHexString}`
          ctx.fillRect(colIndex, rowIndex, 1, 1)
        }
      )
    )
  },
  {
    rows: {
      default: 10,
      parse: parseInteger,
    },
    columns: {
      default: 10,
      parse: parseInteger,
    },
  },
  {
    // size: [300, 300]
    size: [600, 600]
  }
)
