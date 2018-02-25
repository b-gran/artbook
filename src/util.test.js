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