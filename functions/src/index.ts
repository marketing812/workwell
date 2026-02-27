import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import app from "./app";

setGlobalOptions({region: "europe-west4", maxInstances: 1});

export const api = onRequest(
  {
    cors: true,
    timeoutSeconds: 120,
     secrets: ["GEMINI_API_KEY"],
  },
  app
);
