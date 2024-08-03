// api/proxy.js
const fetch = require('node-fetch');

export default async function handler(req, res) {
    const url = req.query.url; // Get the URL from the query parameter
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const response = await fetch(url, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'POST' ? req.body : undefined
        });

        const data = await response.text();
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        res.status(response.status).send(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy request failed' });
    }
}
