import * as R from 'ramda'
import * as util from './util'

describe('util', () => {
  describe('inRange', () => {
    it('returns true if the value is in the bounds (inclusive)', () => {
      expect(util.inRange([0, 10], 0)).toBeTruthy()
      expect(util.inRange([0, 10], 10)).toBeTruthy()
      expect(util.inRange([0, 10], 5)).toBeTruthy()
    })

    it('returns false if the value is out of bounds', () => {
      expect(util.inRange([0, 10], 11)).toBeFalsy()
      expect(util.inRange([0, 10], -1)).toBeFalsy()
    })
  })

  describe('randomInt', () => {
    it('returns values that are within the supplied bounds', () => {
      expect(util.randomInt(1, 1)).toBe(1)
      expect(util.inRange([0, 1], util.randomInt(0, 1))).toBeTruthy()

      const min = 0
      const max = 10
      for (let i = 0; i < 1e3; i++) {
        const random = util.randomInt(min, max)
        expect(random).toBeGreaterThanOrEqual(min)
        expect(random).toBeLessThan(max)
      }
    })
  })

  describe('randomIntWithDistribution', () => {
    const randomInt = util.randomIntWithDistribution(R.identity)
    it('should have the same behavior as randomInt', () => {
      const min = 10
      const max = 20
      for (let i = 0; i < 1e3; i++) {
        const random = randomInt(min, max)
        expect(random).toBeGreaterThanOrEqual(min)
        expect(random).toBeLessThan(max)
      }
    })

    const always0 = util.randomIntWithDistribution(R.always(0))
    it('should always return the min', () => {
      const maxRandomValue = 1e3
      for (let currentMin = 0; currentMin < maxRandomValue; currentMin++) {
        const random = always0(currentMin, maxRandomValue)
        expect(random).toBe(currentMin)
      }
    })

    const always1 = util.randomIntWithDistribution(R.always(1))
    it('should always return the max', () => {
      const maxRandomValue = 1e3
      for (let currentMax = 0; currentMax < maxRandomValue; currentMax++) {
        const random = always1(0, currentMax)
        expect(random).toBe(currentMax)
      }
    })
  })

  describe('sample', () => {
    it('returns references to the input array', () => {
      const obj = {}
      const array = [obj]
      expect(util.sample(array)).toBe(obj)
    })

    it('returns values from the input array', () => {
      const array = [Symbol('a'), Symbol('b'), Symbol('c'), Symbol('d')]
      for (let i = 0; i < 1e3; i++) {
        const sample = util.sample(array)
        expect(array).toContain(sample)
      }
    })
  })

  describe('mod', () => {
    it('returns the correct value when the first operand is positive', () => {
      expect(util.mod(5, 3)).toBe(2)
    })

    it('returns the correct value when the first operand is negative', () => {
      expect(util.mod(-1, 3)).toBe(2)
    })
  })
})