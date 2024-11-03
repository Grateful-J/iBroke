// Subtotal formatter: Rounds to the nearest hundredth and adds commas if >$1k
export const totalFormatter = (number: number) => {
  if (!number || number === 0 || isNaN(number)) {
    return '$0.00'
  } else {
    // Preserve the sign of the number
    const isNegative = number < 0
    const absoluteNumber = Math.abs(number) // Work with absolute value for formatting

    const formattedNumber = absoluteNumber
      .toFixed(2) // Round to two decimal places
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',') // Add commas for thousands

    // Add back the negative sign if applicable and return with '$' sign
    return `${isNegative ? '-' : ''}$${formattedNumber}`
  }
}
