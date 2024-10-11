import bcrypt from "bcryptjs";
import { createJsonwebtoken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { db } from "../db.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const userExists = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!userExists.empty) return res.status(400).json(["email en uso"]);

    const docRef = await db.collection("users").add(newUser);

    const token = await createJsonwebtoken({
      id: docRef.id,
      name: name,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3600000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      name: name,
      id: docRef.id,
      token: token,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    const findUser = userSnapshot.docs[0].data();

    const passwordCompare = await bcrypt.compare(password, findUser.password);

    if (!passwordCompare)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    const token = await createJsonwebtoken({
      id: userSnapshot.docs[0].id,
      name: findUser.name,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3600000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      name: findUser.name,
      id: userSnapshot.docs[0].id,
      email: findUser.email,
      token: token,
    });
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const logOut = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userDoc = await db.collection("users").doc(req.user).get();

  if (!userDoc.exists)
    return res.status(400).json({ message: "User not found" });

  const user = userDoc.data();

  res.send({
    id: userDoc.id,
    name: user.name,
  });
};

export const verifyAuth = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, SECRET_KEY, async (err, user) => {
      if (err) return res.status(401).json({ message: "Invalid token" });

      const findUser = await db.collection("users").doc(user.data.id).get();

      if (!findUser.exists) return res.sendStatus(401);

      const userData = findUser.data();

      return res.json({
        id: findUser.id,
        name: userData.name,
        email: userData.email,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
