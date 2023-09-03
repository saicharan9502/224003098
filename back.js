const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Function to check if a number is prime
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  const uniquePrimes = new Set();

  try {
    // Use Promise.all to concurrently fetch data from multiple URLs
    const promises = urls.map(async (url) => {
      try {
        const response = await axios.get(url);
        const { numbers } = response.data;

        if (Array.isArray(numbers)) {
          numbers.forEach((number) => {
            if (isPrime(number)) {
              uniquePrimes.add(number);
            }
          });
        }
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error.message}`);
      }
    });

    await Promise.all(promises);

    // Convert the set of unique prime numbers to an array and sort it in ascending order
    const sortedPrimes = [...uniquePrimes].sort((a, b) => a - b);

    res.json({ numbers: sortedPrimes });
  } catch (error) {
    console.error(`Error processing numbers: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
