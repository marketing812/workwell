import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const EXTERNAL_SERVICES_BASE_URL = process.env.EXTERNAL_SERVICES_BASE_URL || "https://workwellfut.com";
const DAILY_QUESTION_KEY = process.env.DAILY_QUESTION_KEY || "SJDFgfds788sdfs8888KLLLL";
const NOTEBOOK_API_BASE = `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/wscontenido.php`;
const NOTEBOOK_API_KEY = process.env.NOTEBOOK_API_KEY || "4463";
const NOTEBOOK_TIMEOUT_MS = 15000;
const SECRET_KEY = process.env.ENCRYPTION_SECRET || "0123456789abcdef0123456789abcdef";

function forceEncryptStringAES(value) {
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));
  const encrypted = CryptoJS.AES.encrypt(
    value,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return JSON.stringify({ iv: CryptoJS.enc.Base64.stringify(iv), data: encrypted.toString() });
}

function encryptDataAES(obj) {
  const json = JSON.stringify(obj);
  const iv = CryptoJS.enc.Utf8.parse(SECRET_KEY.substring(0, 16));
  const encrypted = CryptoJS.AES.encrypt(
    json,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return JSON.stringify({ iv: CryptoJS.enc.Base64.stringify(iv), data: encrypted.toString() });
}

app.get("/daily-question", async (req, res) => {
  try {
    const userId = String(req.query.userId || "");
    if (!userId) return res.status(400).json({ questions: [], error: "User ID is required." });

    const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
    const token = Buffer.from(`${DAILY_QUESTION_KEY}|${fecha}`).toString("base64");
    const base64UserId = Buffer.from(userId).toString("base64");
    const externalUrl =
      `${EXTERNAL_SERVICES_BASE_URL}/wp-content/programacion/traejson.php` +
      `?archivo=clima&idusuario=${encodeURIComponent(base64UserId)}&token=${encodeURIComponent(token)}`;

    const response = await fetch(externalUrl, { cache: "no-store" });
    const responseText = await response.text();
    if (!response.ok) {
      return res.status(502).json({ questions: [], error: `External API error (${response.status})`, details: responseText });
    }

    let parsed;
    const trimmed = responseText.trim();
    try {
      if (trimmed.startsWith("[")) {
        const arr = JSON.parse(trimmed);
        parsed = Array.isArray(arr) ? arr[0] : null;
      } else {
        const start = trimmed.indexOf("{");
        const end = trimmed.lastIndexOf("}");
        const payload = start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed;
        parsed = JSON.parse(payload);
      }
    } catch (e) {
      return res.status(502).json({ questions: [], error: "Invalid JSON from external API", details: trimmed.slice(0, 300) });
    }

    if (!parsed || !parsed.codigo || !parsed.pregunta) {
      return res.json({ questions: [], debugUrl: externalUrl });
    }
    return res.json({
      questions: [{ id: String(parsed.codigo), text: String(parsed.pregunta) }],
      debugUrl: externalUrl,
    });
  } catch (error) {
    return res.status(500).json({ questions: [], error: error?.message || "Internal Server Error" });
  }
});

app.post("/save-daily-check-in", async (req, res) => {
  try {
    const { userId, questionCode, answer } = req.body || {};
    if (!userId || !questionCode || !answer) {
      return res.status(400).json({ success: false, message: "Faltan datos en la petición." });
    }
    const encryptedPayload = encryptDataAES({ codigo: questionCode, respuesta: answer });
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardaclima` +
      `&idusuario=${encodeURIComponent(userId)}&token=&datos=${encodeURIComponent(encryptedPayload)}`;

    const saveResponse = await fetch(saveUrl, { method: "GET", signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS) });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({ success: false, message: `Error externo (${saveResponse.status})`, debugUrl: saveUrl });
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === "OK") return res.json({ success: true, message: parsed.message || "Respuesta guardada.", debugUrl: saveUrl });
      return res.status(400).json({ success: false, message: parsed.message || "Error del servicio externo.", debugUrl: saveUrl });
    } catch {
      return res.json({ success: true, message: "Guardado (respuesta no JSON).", debugUrl: saveUrl });
    }
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "Tiempo de espera agotado al conectar con el servidor externo."
      : (error?.message || "Error interno");
    return res.status(500).json({ success: false, message });
  }
});

app.post("/chatbot", async (req, res) => {
  try {
    const { message, context, userName } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const { emotionalChatbot } = await import("../ai/flows/emotional-chatbot.ts");
    const result = await emotionalChatbot({ message: message.trim(), context: context || "", userName: userName || "" });
    const response = typeof result === "string" ? result : (typeof result?.response === "string" ? result.response : "");
    const safe = response.trim() || "No he podido generar una respuesta útil. ¿Puedes reformular la pregunta?";
    return res.json({ success: true, data: { response: safe } });
  } catch (error) {
    return res.status(500).json({ success: false, error: error?.message || "Internal Server Error" });
  }
});

app.post("/knowledge-assistant", async (req, res) => {
  try {
    const { question, context } = req.body || {};
    if (!question || typeof question !== "string") {
      return res.status(400).json({ success: false, error: "Question is required" });
    }
    const { knowledgeAssistant } = await import("../ai/flows/knowledge-assistant.ts");
    const result = await knowledgeAssistant({ question: question.trim(), context: typeof context === "string" ? context : undefined });
    if (!result || !result.response) {
      return res.status(502).json({ success: false, error: "Respuesta incompleta del asistente de conocimiento." });
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error?.message || "Internal Server Error" });
  }
});

app.post("/submit-assessment", async (req, res) => {
  try {
    const { answers } = req.body || {};
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, error: "Answers are required" });
    }
    const scoresOnly = {};
    for (const [key, value] of Object.entries(answers)) {
      const score = Number(value?.score);
      if (!Number.isFinite(score) || score < 1 || score > 5) {
        return res.status(400).json({ success: false, error: `Invalid score for item '${key}'` });
      }
      scoresOnly[key] = score;
    }

    const { initialAssessment } = await import("../ai/flows/initial-assessment.ts");
    const result = await initialAssessment({ answers: scoresOnly });
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error?.message || "Internal Server Error" });
  }
});

app.post("/save-assessment", async (req, res) => {
  try {
    const payloadToSave = req.body;
    if (!payloadToSave) return res.status(400).json({ success: false, message: "Missing payload" });
    const encryptedPayload = encryptDataAES(payloadToSave);
    const saveUrl = `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardarevaluacion&datosEvaluacion=${encodeURIComponent(encryptedPayload)}`;
    const saveResponse = await fetch(saveUrl, { signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS) });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({ success: false, message: `Error externo (${saveResponse.status})`, debugUrl: saveUrl });
    }
    try {
      const parsed = JSON.parse(text);
      return res.json({ success: parsed.status === "OK", message: parsed.message, debugUrl: saveUrl });
    } catch {
      return res.json({ success: true, message: "Guardado (respuesta no JSON).", debugUrl: saveUrl });
    }
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "Tiempo de espera agotado al conectar con el servidor externo."
      : (error?.message || "Error interno");
    return res.status(500).json({ success: false, message });
  }
});

app.post("/save-notebook-entry", async (req, res) => {
  try {
    const { userId, entryData } = req.body || {};
    if (!userId || !entryData) {
      return res.status(400).json({ success: false, message: "Faltan datos en la petición." });
    }
    const encryptedPayload = forceEncryptStringAES(JSON.stringify(entryData));
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardarcuaderno` +
      `&idusuario=${encodeURIComponent(userId)}&token=&datos=${encodeURIComponent(encryptedPayload)}`;
    const saveResponse = await fetch(saveUrl, { method: "GET", signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS) });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({ success: false, message: `Error externo (${saveResponse.status})`, debugUrl: saveUrl });
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === "OK") return res.json({ success: true, message: parsed.message || "Entrada guardada.", debugUrl: saveUrl });
      return res.status(400).json({ success: false, message: parsed.message || "Error del servicio externo.", debugUrl: saveUrl });
    } catch {
      return res.json({ success: true, message: "Guardado (respuesta no JSON).", debugUrl: saveUrl });
    }
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "Tiempo de espera agotado al conectar con el servidor externo."
      : (error?.message || "Error interno");
    return res.status(500).json({ success: false, message });
  }
});

app.post("/save-mood-check-in", async (req, res) => {
  try {
    const { userId, mood, score } = req.body || {};
    if (!userId || !mood || score === undefined) {
      return res.status(400).json({ success: false, error: "Faltan datos en la petición." });
    }
    const encryptedPayload = forceEncryptStringAES(JSON.stringify({ mood, score, timestamp: new Date().toISOString() }));
    const saveUrl =
      `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=guardaranimo` +
      `&idusuario=${encodeURIComponent(userId)}&token=&datos=${encodeURIComponent(encryptedPayload)}`;
    const saveResponse = await fetch(saveUrl, { method: "GET", signal: AbortSignal.timeout(NOTEBOOK_TIMEOUT_MS) });
    const text = await saveResponse.text();
    if (!saveResponse.ok) {
      return res.status(502).json({ success: false, error: `Error externo (${saveResponse.status})`, debugUrl: saveUrl });
    }
    try {
      const parsed = JSON.parse(text);
      if (parsed.status === "OK") return res.json({ success: true, debugUrl: saveUrl });
      return res.status(400).json({ success: false, error: parsed.message || "Error del servicio externo.", debugUrl: saveUrl });
    } catch {
      return res.json({ success: true, debugUrl: saveUrl });
    }
  } catch (error) {
    const message = error?.name === "AbortError"
      ? "Tiempo de espera agotado al conectar con el servidor externo."
      : (error?.message || "Error interno");
    return res.status(500).json({ success: false, error: message });
  }
});

app.get("/trigger-reminder", async (_req, res) => {
  try {
    const url = `${NOTEBOOK_API_BASE}?apikey=${NOTEBOOK_API_KEY}&tipo=getavisoemail`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const text = await response.text();
      return res.status(502).json({ success: false, error: `Error externo (${response.status})`, details: text });
    }
    const result = await response.json();
    return res.json({ success: true, message: result?.message || "OK", data: result?.data || null });
  } catch (error) {
    return res.status(500).json({ success: false, error: error?.message || "Internal Server Error" });
  }
});

const WP_API_BASE = `${EXTERNAL_SERVICES_BASE_URL}/wp-json/wp/v2`;

app.get("/resources", async (_req, res) => {
  try {
    const categoriesRes = await fetch(`${WP_API_BASE}/categories?per_page=100&_fields=id,name,slug,count`);
    if (!categoriesRes.ok) return res.status(502).json({ error: "Failed to fetch categories from WP", status: categoriesRes.status });
    const categories = (await categoriesRes.json()).filter((cat) => cat.slug !== "sin-categoria" && cat.count > 0);
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/resources/category/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const categoriesRes = await fetch(`${WP_API_BASE}/categories?per_page=100&_fields=id,name,slug,count`);
    if (!categoriesRes.ok) return res.status(502).json({ error: "Failed to fetch categories from WP", status: categoriesRes.status });
    const categories = await categoriesRes.json();
    const category = categories.find((c) => c.slug === slug);
    if (!category) return res.status(404).json({ error: "Category not found" });

    const postsRes = await fetch(`${WP_API_BASE}/posts?per_page=100&_embed&_fields=id,slug,title,excerpt,content,date,categories,featured_media,_embedded`);
    if (!postsRes.ok) return res.status(502).json({ error: "Failed to fetch posts from WP", status: postsRes.status });
    const posts = await postsRes.json();
    const filtered = posts.filter((p) => Array.isArray(p.categories) && p.categories.includes(category.id));
    return res.json({ category, posts: filtered });
  } catch (_error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/resources/post/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const postRes = await fetch(`${WP_API_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed&_fields=id,slug,title,excerpt,content,date,categories,featured_media,_embedded`);
    if (!postRes.ok) return res.status(502).json({ error: "Failed to fetch post from WP", status: postRes.status });
    const posts = await postRes.json();
    return res.json(posts[0] || null);
  } catch (_error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
