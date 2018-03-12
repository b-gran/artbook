import * as R from 'ramda'

export const inRange = R.curry((bounds, value) => {
  return value >= bounds[0] && value <= bounds[1]
})

// Return a random integer in the range [min, max) exclusive using the supplied function
// for randomness.
// The function `random` must return values in the range [0, 1)
function randomIntBy (random, min, max) {
  const actualMin = Math.min(min, max)
  const actualMax = Math.max(min, max)
  return Math.floor(random() * (actualMax - actualMin)) + actualMin
}

// // Return a (uniformly) random integer in the range [min, max) exclusive
export const randomInt = R.curry(randomIntBy)(Math.random)

// Return a random integer between min and max selected from a non-uniform distribution.
// f represents the distribution. f must take a value in [0, 1) and return a value in [0, 1)
export const randomIntWithDistribution = R.pipe(
  // Given a function f that maps random numbers to other floats in [0, 1),
  // returns a new 0-arity function that calls f with a random float.
  R.flip(R.map)(Math.random),

  // Passes the transformed RNG to the random int function
  R.curry(randomIntBy)
)

// Return a value taken uniformly at random from an array
export function sample (array) {
  if (!array || R.isEmpty(array)) {
    return undefined
  }

  return array[randomInt(0, array.length)]
}

// Computes n (mod m)
// Handles negative n (unlike the ordinary % operator
export function mod (n, m) {
  return ((n % m) + m) % m
}

export function getPermutation (min = 0, max = 255) {
  const numbers = R.range(min, max + 1)
  const result = []
  while (!R.isEmpty(numbers)) {
    const index = randomInt(0, numbers.length)
    const element = numbers.splice(index, 1)[0]
    result.push(element)
  }
  return result
}

export function toHexString (n) {
  const unpaddedHexString = n.toString(16)
  return n < 0x10
    ? `0${unpaddedHexString}`
    : unpaddedHexString
}
