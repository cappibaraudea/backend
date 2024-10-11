import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { ACCESS_KEY } from "./config.js";

const serviceAccount = ACCESS_KEY;

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
