import assert from 'assert'
import * as R from 'ramda'
import { inRange, mod } from './util'

export const updateMatrix = R.useWith(R.assocPath, [R.identity, R.identity, R.clone])

// Algo for applying a kernel to an image
// The kernel is an n x n matrix of Numbers
// The "image" is an m x m matrix of Numbers (hex numbers in the range 0x000000 - 0xFFFFFF)
//
// for each image row in input image:
//   for each pixel in image row:
//
//   set accumulator to zero
//
//   for each kernel row in kernel:
//   for each element in kernel row:
//
//     if element position  corresponding* to pixel position then
//         multiply element value  corresponding* to pixel value
//         add result to accumulator
//     endif
//
// set output image pixel to accumulator

export const convolveWith = R.curry((f, kernel, image) => {
  assertMatrix(kernel)
  assertMatrix(image)
  assert(R.is(Function, f))

  const kernelCenter = getMatrixCenter(kernel)

  forEachMatrix(
    (pixel, [row, col], imageMatrix, [height, width]) => {
      let accumulator = 0
      forEachMatrix(
        (kernelValue, [kernelRow, kernelCol]) => {
          // Wraps around to the other side of the image if the pixel is outside the
          // image matrix.
          const [targetRow, targetCol] = [
            mod(kernelCenter[0] - kernelRow + row, height),
            mod(kernelCenter[1] - kernelCol + col, width),
          ]

          const targetPixel = image[targetRow][targetCol]
          accumulator = accumulator + (kernelValue * targetPixel)
        },
        kernel
      )

      // Set the image pixel equal to the accumulator after applying the transformer.
      image[row][col] = f(accumulator)
    },
    image
  )

  return image
})

// forEachMatrix :: (a -> ()) -> Matrix a -> ()
// Iterate over all elements of a matrix, calling a function with each element.
// The function is called as follows:
//    f(element: a, position: [rowIndex(int), columnIndex(int)], matrix: Matrix a, matrixDimensions: [rows(int), columns(int)])
export function forEachMatrix (f, matrix) {
  const dimensions = getMatrixDimensions(matrix)
  for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
    const row = matrix[rowIndex]

    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const element = row[columnIndex]
      f(element, [rowIndex, columnIndex], matrix, dimensions)
    }
  }
}

// mapMatrix :: (a -> b) -> Matrix a -> b
// Iterate over all elements of a matrix, creating a new matrix whose values are the
// result of iteratee applied to the result of the input matrix.
// The function is called as follows:
//    f(element: a, position: [rowIndex(int), columnIndex(int)], matrix: Matrix a, matrixDimensions: [rows(int), columns(int)])
export function mapMatrix (f, matrix) {
  const copy = []
  if (!matrix) {
    return copy
  }

  forEachMatrix(
    (el, [row, column], ...rest) => {
      copy[row] = copy[row] || []
      copy[row][column] = f(el, [row, column], ...rest)
    },
    matrix
  )
  return copy
}

export function isKernelInImage (kernel, image, [row, column]) {
  const imageDimensions = getMatrixDimensions(image)
  const [kernelRow, kernelColumn] = getMatrixCenter(kernel)
  return (
    inRange([0, imageDimensions[0] - 1], row - kernelRow) &&
    inRange([0, imageDimensions[0] - 1], row + kernelRow) &&
    inRange([0, imageDimensions[1] - 1], column - kernelColumn) &&
    inRange([0, imageDimensions[1] - 1], column + kernelColumn)
  )
}

export function getMatrixCenter (matrix) {
  const [rows, columns] = getMatrixDimensions(matrix)
  return [
    (rows / 2)|0,
    (columns / 2)|0,
  ]
}

export function getMatrixDimensions (matrix) {
  if (!matrix || matrix.length === 0) {
    return [0, 0]
  }

  return [
    matrix.length,
    matrix[0].length,
  ]
}

export function assertMatrix (maybeMatrix) {
  assert(Array.isArray(maybeMatrix), 'not an Array')
  assert(maybeMatrix.length === 0 || Array.isArray(maybeMatrix[0]), 'elements are not Arrays')
}
