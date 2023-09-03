const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const primeUrl = 'http://20.244.56.144/numbers/primes'; // URL that generates prime numbers

  try {
    const response = await axios.get(primeUrl);
    const { numbers } = response.data;

    if (Array.isArray(numbers)) {
      const sortedNumbers = numbers.sort((a, b) => a - b);
      res.json({ numbers: sortedNumbers });
    } else {
      res.status(500).json({ error: 'Invalid response from prime numbers API' });
    }
  } catch (error) {
    console.error(`Error fetching prime numbers: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
