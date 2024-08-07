const fetch = require('node-fetch');

export default async function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        console.error('URL parameter is missing');
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        // Make the request to the target URL
        console.log(`Fetching URL: ${targetUrl}`);
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                ...req.headers,
                'Host': undefined, // Remove Host header to avoid conflicts
            },
            body: req.method === 'POST' ? req.body : undefined
        });

        // Check if the response is successful
        if (!response.ok) {
            console.error(`Failed to fetch URL: ${targetUrl}, Status: ${response.status}`);
            return res.status(response.status).json({ error: `Failed to fetch ${targetUrl}` });
        }

        // Handle different content types
        const contentType = response.headers.get('Content-Type');
        if (contentType.includes('application/json')) {
            const jsonData = await response.json();
            res.json(jsonData);
        } else {
            const data = await response.text();
            res.setHeader('Content-Type', contentType);
            res.send(data);
        }
    } catch (error) {
        console.error('Error in proxy function:', error);
        res.status(500).json({ error: 'Proxy request failed' });
    }
}
