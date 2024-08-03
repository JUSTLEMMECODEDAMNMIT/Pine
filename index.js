const express = require('express');
const axios = require('axios');
const app = express();

const GITHUB_API_BASE_URL = 'https://api.github.com';

app.use(express.json());

app.get('/github/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryParams = req.query;

  try {
    const response = await axios.get(`${GITHUB_API_BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: queryParams
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

app.post('/github/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const body = req.body;

  try {
    const response = await axios.post(`${GITHUB_API_BASE_URL}/${endpoint}`, body, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
