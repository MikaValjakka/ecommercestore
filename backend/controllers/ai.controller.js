import openai from "../lib/openai.js";

// Yksinkertainen välimuisti AI:n generoimalle kausitekstille
let cachedText = null; // Viimeksi generoitu AI:n teksti
let cachedSeason = null; // Kausi, johon edellinen teksti liittyi

// Funktio, joka palauttaa nykyisen vuodenajan
// Palauttaa yhden arvon: "winter", "spring", "summer" tai "autumn"
function getSeason() {
  const month = new Date().getMonth() + 1; // getMonth() antaa 0-11 → +1 jotta saadaan 1-12

  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  return "autumn"; // 9-11
}

// Reitti (API endpoint) joka palauttaa kausittaisen muotisuosituksen
export const getSeasonalRecommendation = async (req, res) => {
  try {
    const season = getSeason(); // Selvitetään tämänhetkinen kausi

    // Välimuistintarkistus (cache-hit)
    // Jos viimeksi generoitu teksti on samaan kauteen liittyvä, ei tehdä AI-kutsua
    if (cachedText && cachedSeason === season) {
      return res.json({ text: cachedText }); // Palautetaan välimuistissa oleva teksti
    }

    // AI:n prompt
    const prompt = `
You are an e-commerce fashion assistant.
Write ONE short homepage sentence (max 15 words).

Season: ${season}

Rules:
- Simple and friendly tone
- Mention ONE clothing item
- No emojis
- No exclamation overload
`;

    // Kutsutaan OpenAI:n Chat Completions API:ta
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // Kevyt mutta laadukas malli
      messages: [{ role: "user", content: prompt }],
      max_tokens: 30, // Lyhyt vastaus (max 15 sanaa)
      temperature: 0.7, // Luovuutta lisäävä parametri
    });

    // Haetaan AI:n generoima teksti vastauksesta
    const text = response.choices[0].message.content.trim();

    // Tallennetaan välimuistiin, jotta seuraavalla kerralla ei tehdä uutta AI-kutsua
    cachedText = text;
    cachedSeason = season;

    // Palautetaan JSON-vastauksena frontendille
    res.json({ text });
  } catch (error) {
    // Virhetilanteessa logataan error ja palautetaan fallback-teksti
    console.error("AI seasonal recommendation error:", error.message);
    res.status(500).json({
      text: "Discover the latest in fashion and style", // fallback
    });
  }
};
