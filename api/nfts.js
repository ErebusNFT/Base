// Path: /api/nfts
// Vercel serverless function to proxy GoldRush / Covalent
// and avoid CORS + hide your API key.

export default async function handler(req, res) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Missing address" });
  }

  // 🔑 Your GoldRush / Covalent API key
  const API_KEY = "cqt_rQGGbbFBj7MFP7dbX7wtYGbpDCyj";

  // NOTE: cqt_ keys usually use the /v1/cqt/... path
  const url =
    `https://api.covalenthq.com/v1/cqt/8453/address/${address}/balances_v2/?nft=true&no-nft-fetch=false`;

  try {
    const apiRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const text = await apiRes.text(); // read raw, then try to JSON parse

    if (!apiRes.ok) {
      // pass through upstream status and body to help debugging
      return res
        .status(apiRes.status)
        .json({ error: "Upstream API error", status: apiRes.status, body: text });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({ error: "Failed to parse API JSON", raw: text });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message || String(err) });
  }
}
