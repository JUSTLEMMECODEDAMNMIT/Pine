const express = require('express');
const axios = require('axios');
const app = express();

const GITHUB_API_BASE_URL = 'https://api.github.com';

app.use(express.json());

app.get('/github/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryParams = req.query;

  try {
    console.log(`Request to /github/${endpoint} with params:`, queryParams);
    const response = await axios.get(`${GITHUB_API_BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      params: queryParams
    });

    console.log(`GitHub API response for /${endpoint}:`, response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error during GET /github/${endpoint}:`, error);
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
    console.log(`Request to POST /github/${endpoint} with body:`, body);
    const response = await axios.post(`${GITHUB_API_BASE_URL}/${endpoint}`, body, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    console.log(`GitHub API response for POST /${endpoint}:`, response.data);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error during POST /github/${endpoint}:`, error);
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
