import * as R from 'ramda'
import experiment from './experiment'

const COLOR = {
  BLACK: 'BLACK',
  WHITE: 'WHITE',
}

const swapColor = R.flip(R.prop)({
  [COLOR.BLACK]: COLOR.WHITE,
  [COLOR.WHITE]: COLOR.BLACK,
})

const sample = list => list[Math.floor(Math.random() * list.length)]

const WHITE_BLACK_DELTA_P = 0.333

const makeVerticalSlice = height => {
  return R.scan(
    last => {
      return {
        // [COLOR.BLACK]: (Math.random() > (0.5 - WHITE_BLACK_DELTA_P)) ? COLOR.BLACK : COLOR.WHITE,
        // [COLOR.WHITE]: (Math.random() > (0.5 + (WHITE_BLACK_DELTA_P / 2))) ? COLOR.BLACK : COLOR.WHITE,

        // [COLOR.BLACK]: (Math.random() > 0.2) ? COLOR.BLACK : COLOR.WHITE,
        // [COLOR.WHITE]: (Math.random() > 0.6) ? COLOR.BLACK : COLOR.WHITE,

        [COLOR.BLACK]: (Math.random() > 0.5) ? COLOR.BLACK : COLOR.WHITE,
        [COLOR.WHITE]: (Math.random() > 0.5) ? COLOR.BLACK : COLOR.WHITE,
      }[last]
    },
    sample([ COLOR.BLACK, COLOR.WHITE ]),
    R.range(0, height - 1)
  )
}

const jitterSlice = slice => {
  return slice.map(
    color => ({
      true: swapColor(color),
      false: color,
    }[Math.random() > 0.75])
  )
}

const drawSlice = R.curry((x, slice, ctx) => {
  slice.forEach((color, idx) => {
    ctx.fillStyle = {
      [COLOR.BLACK]: 'black',
      [COLOR.WHITE]: 'white',
    }[color]
    ctx.fillRect(x, idx, 1, 1)
  })
})

export default experiment(canvas => {
  const ctx = canvas.getContext('2d')
  const size = [300, 300]

  // R.times(
  //   n => drawSlice(n, makeVerticalSlice(size[1]), ctx),
  //   size[0]
  // )

  const slice = makeVerticalSlice(size[1])
  R.times(
    n => drawSlice(n, jitterSlice(slice), ctx),
    size[0]
  )
})
