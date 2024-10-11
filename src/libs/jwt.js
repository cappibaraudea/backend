import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

export function createJsonwebtoken(data) {
  return new Promise((res, rej) => {
    const token = jwt.sign(
      { data },
      SECRET_KEY,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) return rej(err);
        res(token);
      }
    );
  });
}
