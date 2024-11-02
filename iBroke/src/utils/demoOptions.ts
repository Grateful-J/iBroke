// Demo data Generator
const demoOptions = [
  // Repeated and varied entries to fill up to 100 items
  ...Array(100)
    .fill()
    .map((_, index) => ({
      type: ['Call', 'Put'][Math.floor(Math.random() * 2)],
      action: ['Buy to Close', 'Sell to Open', 'Buy to Open', 'Sell to Close'][
        Math.floor(Math.random() * 4)
      ],
      ticker: ['AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN', 'NVDA'][
        Math.floor(Math.random() * 6)
      ],
      strike: Math.floor(Math.random() * 300) + 100, // Random strike price from 100 to 400
      expiration: `202${Math.floor(index / 33) + 3}-${Math.floor(
        Math.random() * 12 + 1,
      )
        .toString()
        .padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1)
        .toString()
        .padStart(2, '0')}`, // Expiration dates from 2023 to 2025
      status: ['open', 'closed', 'expired'][Math.floor(Math.random() * 3)],
    })),
]

export default demoOptions
