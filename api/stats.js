export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const source = process.env.NEKORA_STATS_URL;
  if (!source) {
    return res.status(503).json({ error: 'Stats source not configured' });
  }
  try {
    const response = await fetch(source, { headers: { Accept: 'application/json' } });
    if (!response.ok) return res.status(502).json({ error: 'Stats source unavailable' });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'Could not retrieve bot statistics' });
  }
}
