import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

export const authRequired = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(500)
        .json({ mensage: "No token, authorization denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(400).json({ error: "Invalid token" });

      req.user = { id: user.data.id, name: user.data.name };

      // console.log({ id: user.data.id, name: user.data.name });
    });

    next();
  } catch (error) {
    res.status(500).json({ mensage: error.mensage });
  }
};
