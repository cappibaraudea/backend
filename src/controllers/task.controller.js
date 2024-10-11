import { db } from "../db.js";
import { FieldValue } from "firebase-admin/firestore";

export const getTasks = async (req, res) => {
  try {
    // console.log({ id: req.user.id });
    const tasksSnapshot = await db
      .collection("tasks")
      .where("user.id", "==", req.user.id)
      .get();

    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(tasks);

    console.log(tasks);
  } catch (error) {
    res.status(500).json(error.mensage);
  }
};

export const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const taskDoc = await db.collection("tasks").doc(taskId).get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = taskDoc.data();

    const userDoc = await db.collection("users").doc(task.user.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDoc.data();

    const userWithId = {
      id: userDoc.id,
      ...user,
    };

    const { password, ...userWithoutPassword } = userWithId;

    res.json({
      ...task,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, address, date, hour, url, attendees } =
      req.body;

    const newTask = {
      title,
      description,
      address,
      date,
      hour,
      attendees: attendees || [],
      url,
      user: req.user,
    };

    const docRef = await db.collection("tasks").add(newTask);

    res.json({
      id: docRef.id,
      message: "Tarea creada correctamente",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const taskDoc = await db.collection("tasks").doc(taskId).get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    await db.collection("tasks").doc(taskId).delete();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, address, date, hour, url } = req.body;

    const taskRef = db.collection("tasks").doc(taskId);

    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRef.update({ title, description, address, date, hour, url });

    const updatedTaskDoc = await taskRef.get();
    const updatedTask = updatedTaskDoc.data();

    res.json({
      id: taskId,
      ...updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const tasksSnapshot = await db.collection("tasks").get();

    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(tasks);

    console.log(tasks);
  } catch (error) {
    res.status(500).json(error.mensage);
  }
};

export const makeAttend = async (req, res) => {
  try {
    const { taskId, userId, userName } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskId" });
    }

    const taskDoc = await db.collection("tasks").doc(taskId).get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    const attendees = taskDoc.data().attendees || [];

    const attendee = {
      name: userName,
      id: userId,
    };

    const attendeeExists = attendees.some((a) => a.id === userId);

    if (attendeeExists) {
      await db
        .collection("tasks")
        .doc(taskId)
        .update({
          attendees: FieldValue.arrayRemove(attendee),
        });
      return res
        .status(200)
        .json({ message: "Asistencia removida exitosamente" });
    } else {
      await db
        .collection("tasks")
        .doc(taskId)
        .update({
          attendees: FieldValue.arrayUnion(attendee),
        });
      return res
        .status(200)
        .json({ message: "Asistencia agregada exitosamente" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
