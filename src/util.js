import * as R from 'ramda'

export const inRange = R.curry((bounds, value) => {
  return value >= bounds[0] && value <= bounds[1]
})

export function randomInt (min, max) {
  const actualMin = Math.min(min, max)
  const actualMax = Math.max(min, max)
  return Math.floor(Math.random() * (actualMax - actualMin)) + actualMin
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
