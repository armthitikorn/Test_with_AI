export default function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing GEMINI_API_KEY in Vercel Environment Variables" });
  }

  // ส่ง API Key ให้กับฝั่ง Front-end เพื่อสร้าง WebSocket Direct Connection
  res.status(200).json({ key: apiKey });
}
