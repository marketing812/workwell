import express from "express";
import cors from "cors";
import CryptoJS from "crypto-js";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// usa process.env.* (ya no dotenv aquí)
const EXTERNAL_SERVICES_BASE_URL = process.env.EXTERNAL_SERVICES_BASE_URL || "https://workwellfut.com";
const DAILY_QUESTION_KEY = process.env.DAILY_QUESTION_KEY || "SJDFgfds788sdfs8888KLLLL";
const NOTEBOOK_API_KEY = process.env.NOTEBOOK_API_KEY || "4463";
const SECRET_KEY = process.env.ENCRYPTION_SECRET || "0123456789abcdef0123456789abcdef";

// ... pega aquí tus funciones helper y rutas de src/backend/server.js ...
// app.get("/daily-question", ...)
// app.post("/chatbot", ...)
// etc.

export default app;
