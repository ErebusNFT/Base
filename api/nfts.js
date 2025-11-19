// Path: /api/nfts
// Vercel serverless function to proxy GoldRush / Covalent
// and avoid CORS + hide your API key.

export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Missing address" });
  }

  // 🔑 YOUR REAL GOLDRUSH / COVALENT API KEY
  // You can put it directly here, or better: read from process.env later.
  const API_KEY = "cqt_rQGGbbFBj7MFP7dbX7wtYGbpDCyj";

  const url =
    `https://api.covalenthq.com/v1/base-mainnet/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!apiRes.ok) {
      return res
        .status(apiRes.status)
        .json({ error: "Upstream API error", status: apiRes.status });
    }

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message || String(err) });
  }
}
