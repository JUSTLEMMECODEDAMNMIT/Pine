const fetch = require('node-fetch');

export default async function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        console.error('URL parameter is missing');
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        console.log(`Fetching URL: ${targetUrl}`);
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'POST' ? req.body : undefined
        });

        if (!response.ok) {
            console.error(`Failed to fetch URL: ${targetUrl}, Status: ${response.status}`);
            return res.status(response.status).json({ error: `Failed to fetch ${targetUrl}` });
        }

        const data = await response.text();
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        res.status(response.status).send(data);
    } catch (error) {
        console.error('Error in proxy function:', error);
        res.status(500).json({ error: 'Proxy request failed' });
    }
}
