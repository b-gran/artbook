import * as matrix from './matrix'
import * as R from 'ramda'
import assert from 'assert'

describe('forEachMatrix', () => {
  it('calls the iteratee with the correct arguments for each element', () => {
    let countFunctionCalls = 0
    const testMatrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]

    const actualMatrixDimensions = matrix.getMatrixDimensions(testMatrix)
    const actualRow = n => (n / actualMatrixDimensions[0])|0
    const actualColumn = n => (n % actualMatrixDimensions[1])

    matrix.forEachMatrix(
      (el, [row, column], m, dimensions) => {
        expect(actualRow(countFunctionCalls)).toBe(row)
        expect(actualColumn(countFunctionCalls)).toBe(column)
        expect(m).toBe(testMatrix)
        expect(el).toBe(testMatrix[row][column])
        expect(dimensions[0]).toBe(actualMatrixDimensions[0])
        expect(dimensions[1]).toBe(actualMatrixDimensions[1])

        countFunctionCalls += 1
      },
      testMatrix
    )
  })
})

describe('mapMatrix', () => {
  const testMatrix = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]

  it('calls the iteratee with every element in the input matrix', () => {
    let countFunctionCalls = 0

    const actualMatrixDimensions = matrix.getMatrixDimensions(testMatrix)
    const actualRow = n => (n / actualMatrixDimensions[0])|0
    const actualColumn = n => (n % actualMatrixDimensions[1])

    matrix.forEachMatrix(
      (el, [row, column], m, dimensions) => {
        expect(actualRow(countFunctionCalls)).toBe(row)
        expect(actualColumn(countFunctionCalls)).toBe(column)
        expect(m).toBe(testMatrix)
        expect(el).toBe(testMatrix[row][column])
        expect(dimensions[0]).toBe(actualMatrixDimensions[0])
        expect(dimensions[1]).toBe(actualMatrixDimensions[1])

        countFunctionCalls += 1
      },
      testMatrix
    )
  })

  it('returns a new matrix whose values are the result of calling the iteratee', () => {
    const iteratee = n => n + 3
    const expectedResult = [
      [3,  4,  5],
      [6,  7,  8],
      [9, 10, 11],
    ]

    const actualMappedMatrix = matrix.mapMatrix(iteratee, testMatrix)
    expect(actualMappedMatrix).toEqual(expectedResult)
  })
})

describe('isKernelInImage', () => {
  const kernel = [
    [1, 2, 3],
    [1, 2, 3],
    [1, 2, 3],
  ]
  const testMatrix = [
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6]
  ]

  it('returns true when the kernel is contained completely by the image', () => {
    expect(matrix.isKernelInImage(
      kernel,
      testMatrix,
      [1, 1]
    )).toBeTruthy()
  })

  it('returns false when the kernel is not contained', () => {
    expect(!matrix.isKernelInImage(
      kernel,
      testMatrix,
      [3, 4]
    )).toBeTruthy()

    expect(!matrix.isKernelInImage(
      kernel,
      testMatrix,
      [0, 0]
    )).toBeTruthy()
  })
})

describe('getMatrixCenter', () => {
  it('returns the center of non-square matrices', () => {
    expect(matrix.getMatrixCenter([
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [1, 2, 3, 4],
    ])).toEqual([1, 2])
  })

  it('returns the center of square matrices', () => {
    expect(matrix.getMatrixCenter([
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ])).toEqual([1, 1])
  })
})

describe('getMatrixDimensions', () => {
  it('returns the dimensions of the matrix', () => {
    expect(matrix.getMatrixDimensions([
      [1, 2, 3, 4],
      [1, 2, 3, 4],
      [1, 2, 3, 4],
    ])).toEqual([3, 4])
  })
})

describe('convolveWith', () => {
  const identityKernel = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]

  const blurKernel = [
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
    [1/9, 1/9, 1/9],
  ]

  const testMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]

  it('convolves the input with the kernel and applies the transformer', () => {
    let copy = R.clone(testMatrix)
    matrix.convolveWith(R.identity, identityKernel, copy)
    expect(copy).toEqual(testMatrix)

    const fn = R.add(1)
    copy = R.clone(testMatrix)
    matrix.convolveWith(fn, identityKernel, copy)
    matrix.forEachMatrix(
      (el, [row, column]) => {
        expect(el).toBe(fn(testMatrix[row][column]))
      },
      copy
    )
  })

  it('correctly applies non-identity kernels', () => {
    // TODO: is this even right??
    const expectedBlurResult = [
      [ 5, 5.444444444444444, 5.8271604938271615 ],
      [ 6.141289437585734, 6.379210486206371, 6.532456095784856 ],
      [ 6.591617884205395, 6.546242093561551, 6.384713437290611 ]
    ]

    let copy = R.clone(testMatrix)
    matrix.convolveWith(R.max(0), blurKernel, copy)

    expect(copy).toEqual(expectedBlurResult)
  })
})

