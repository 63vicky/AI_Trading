const axios = require('axios');

// Fetch real-time market data for a symbol
exports.getMarketData = async (req, res) => {
  try {
    const { symbol } = req.params;

    // Replace with your actual market data API
    const response = await axios.get(
      `https://api.example.com/market/${symbol}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MARKET_DATA_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ message: 'Error fetching market data' });
  }
};

// Get historical market data
exports.getHistoricalData = async (req, res) => {
  try {
    const { symbol, interval, startDate, endDate } = req.query;

    // Replace with your actual historical data API
    const response = await axios.get(
      `https://api.example.com/historical/${symbol}`,
      {
        params: {
          interval,
          startDate,
          endDate,
        },
        headers: {
          Authorization: `Bearer ${process.env.MARKET_DATA_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ message: 'Error fetching historical data' });
  }
};

// Get market summary
exports.getMarketSummary = async (req, res) => {
  try {
    // Replace with your actual market summary API
    const response = await axios.get('https://api.example.com/market/summary', {
      headers: {
        Authorization: `Bearer ${process.env.MARKET_DATA_API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market summary:', error);
    res.status(500).json({ message: 'Error fetching market summary' });
  }
};

// Search for symbols
exports.searchSymbols = async (req, res) => {
  try {
    const { query } = req.query;

    // Replace with your actual symbol search API
    const response = await axios.get(`https://api.example.com/search`, {
      params: { query },
      headers: {
        Authorization: `Bearer ${process.env.MARKET_DATA_API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error searching symbols:', error);
    res.status(500).json({ message: 'Error searching symbols' });
  }
};

// Get technical indicators
exports.getTechnicalIndicators = async (req, res) => {
  try {
    const { symbol, indicators } = req.query;

    // Replace with your actual technical indicators API
    const response = await axios.get(
      `https://api.example.com/technical/${symbol}`,
      {
        params: { indicators },
        headers: {
          Authorization: `Bearer ${process.env.MARKET_DATA_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching technical indicators:', error);
    res.status(500).json({ message: 'Error fetching technical indicators' });
  }
};
