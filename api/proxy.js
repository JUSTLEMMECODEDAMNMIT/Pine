const fetch = require('node-fetch');

export default async function handler(req, res) {
    const targetUrl = req.query.url;

    // Validate URL
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Fetch the content from the target URL
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'POST' ? req.body : undefined
        });

        // Check if the response is successful
        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch ${targetUrl}` });
        }

        // Send the response back to the client
        const data = await response.text();
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        res.status(response.status).send(data);
    } catch (error) {
        console.error('Proxy error:', error); // Log error details for debugging
        res.status(500).json({ error: 'Proxy request failed' });
    }
}
