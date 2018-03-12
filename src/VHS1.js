import * as R from 'ramda'
import { controlExperiment } from './experiment'
import { randomInt, randomIntWithDistribution, sample } from './util'

const randomIntWithHighBias = randomIntWithDistribution(x => -Math.pow(x-1, 2) + 1)

// Returns an array of bars. The bars have random heights and random y positions.
// Each bar has the shape { id: string; height: int; top: int }
function getBars (imageHeight) {
  // Generate a random number of bars (in a range)
  const minBars = 1
  const maxBars = 6
  const bars = randomInt(minBars, maxBars)

  const lineHeight = 0.01 // Max height of a corrupted scan line (in % of height)
  const maxCorruptedPixels = 0.4 // Maximum amount of corrupted pixels (% of total pixels)
  const maxLines = (maxCorruptedPixels / lineHeight)|0 // Maximum number of scan lines (integer)

  // Range of size for each bar (number of lines)
  const minBarHeight = 2
  const maxBarHeight = 10

  // Total number of lines split between all bars
  const numberLines = randomInt(
    bars * minBarHeight,
    Math.min(bars * maxBarHeight, maxLines)
  )

  // Maps barId -> barHeightInLines
  const remainingBars = R.range(0, bars)
  const barHeights = remainingBars
    .reduce((heights, n) => R.assoc(n, minBarHeight, heights), {})
  let totalHeight = bars * minBarHeight

  // Assign the minimum value to each bar
  // While there are lines left, keep adding lines to random bars
  while (totalHeight < numberLines && !R.isEmpty(remainingBars)) {
    const bar = sample(remainingBars)
    barHeights[bar] += 1
    totalHeight += 1

    if (barHeights[bar] >= maxBarHeight) {
      remainingBars.splice(remainingBars.indexOf(bar), 1)
    }
  }

  // Min distance between consecutive bars
  const minBarSeparation = 2 * lineHeight
  const minBarSeparationPixels = (minBarSeparation * imageHeight)|0

  // Bars initially have minimum separation
  const [ barPositions, totalHeightPixels ] = R.toPairs(barHeights)
    .reduce(([ positions, totalHeight ], [ id, height ]) => {
      // Height is currently in units of lines. Line height is in percent of total height.
      const heightPixels = (height * lineHeight * imageHeight)|0

      // Top is the y position of the top of the bar.
      // Add some margin above the bar.
      const top = (totalHeight + minBarSeparationPixels)

      return [
        // Add the new bar to the accumulated list
        positions.concat([ { id, height: heightPixels, top, } ]),

        // Add the height of the bar plus the separation above the bar to the total height.
        totalHeight + heightPixels + minBarSeparationPixels,
      ]
    }, [ [], 0 ])

  const lineHeightPixels = (lineHeight * imageHeight)|0

  // Choose a random amount of total spacing between the bars.
  // The amount is biased toward more spacing.
  const maxRemainingSpace = imageHeight - totalHeightPixels
  // let remainingSpace = randomInt(0, maxRemainingSpace)
  let remainingSpace = randomIntWithHighBias(0, maxRemainingSpace)

  // Keep adding lines of separation while there's some space remaining
  while (remainingSpace > 0 && remainingSpace >= lineHeightPixels) {
    const barIndex = randomInt(0, bars)
    const separation = randomInt(lineHeightPixels, remainingSpace)

    // TODO: can skip nested loop by accumulating these deltas, but not super important now
    // Shift the selected bar and the ones below by the separation
    for (let currentBar = barIndex; currentBar < bars; currentBar++) {
      const bar = barPositions[currentBar]
      bar.top += separation
    }

    remainingSpace -= separation
  }

  return barPositions
}

export default controlExperiment(
  (canvas, controls) => {
    const ctx = canvas.getContext('2d');

    loadImage('/rhino.jpg')
      .then(img => {
        ctx.drawImage(img, 0, 0)
        img.style.display = 'none'

        const bars = getBars(img.height)

        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
        bars.forEach(bar => {
          ctx.fillRect(0, bar.top, img.width, bar.height)
        })

        // const pixels = ctx.getImageData(0, 0, 500, 500)
        // const dataBuffer = pixels.data

        // Get data of first pixel
        // const [r, g, b, a] = pixels.data
      })
      .catch(imgOrError => {
        console.error('Failed to load image')
        console.log(imgOrError)
      })
  },
  {},
  {
    size: [500, 500],
    name: 'VHS1'
  }
)

// Will time out after 1s, so don't load large images ;)
function loadImage (src) {
  return new Promise((resolve, reject) => {
    const resolveOnce = R.once(resolve)
    const rejectOnce = R.once(reject)

    const img = new Image();
    img.src = src
    img.onload = () => resolveOnce(img)
    img.onerror = () => rejectOnce(img)

    setTimeout(() => rejectOnce(img), 1000)
  })
}

