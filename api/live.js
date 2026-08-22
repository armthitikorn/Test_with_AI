export default function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    res.status(500).json({ error: "No API Key" });
    return;
  }
  
  res.status(200).json({ key: apiKey });
}
