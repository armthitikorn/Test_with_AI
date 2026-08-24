// qcAnalyzer.js
async function runQCEvaluation(transcriptData, apiKey) {
  if (!apiKey) {
    console.error("❌ QC Analyzer: ไม่พบ API Key");
    return null;
  }

  if (!transcriptData || transcriptData.length === 0) {
    console.warn("⚠️ QC Analyzer: ไม่มีข้อมูลบทสนทนา");
    return null;
  }

  try {
    const promptText = `
    คุณคือผู้เชี่ยวชาญด้าน QC สาย Telesales ประกันภัย 
    โปรดวิเคราะห์บทสนทนานี้และตอบกลับมาเป็น JSON ล้วนๆ ห้ามใส่ Markdown:
    {
      "score": 85,
      "strengths": ["จุดแข็ง 1"],
      "improvements": ["จุดพัฒนา 1"],
      "fatalMistakes": []
    }
    
    บทสนทนา:
    ${JSON.stringify(transcriptData, null, 2)}`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(rawText); // คืนค่า Object ที่วิเคราะห์เสร็จแล้วกลับไป
    
  } catch (err) {
    console.error("⚠️ QC Analyzer Error:", err.message);
    return { error: err.message };
  }
}
