import express from "express";
import mongoose from "mongoose";
import dbConnect from "../config/db.js";
import cors from "cors";

const APP = express();
APP.use(cors());
APP.use(express.json());

// Connect to MongoDB
dbConnect()
  .then(function () {
    console.log("DB Connected");
  })
  .catch(function (err) {
    console.log("DB Connection Failed", err);
  });

// Schema for users collection
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  place: String,
});

const Kitten = mongoose.model("users", userSchema);

// GET /users - Get all users
APP.get("/users", async (req, res) => {
  try {
    const result = await Kitten.find();
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// GET /users/:id - Get single user by ID
APP.get("/users/:id", async (req, res) => {
  try {
    const user = await Kitten.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// POST /users - Create a new user
APP.post("/users", async (req, res) => {
  try {
    const newUser = await Kitten.create(req.body);
    res.status(201).send({ msg: "User added in DB", data: newUser });
  } catch (err) {
    console.error(err);
    res.status(400).send({ error: err.message });
  }
});

// PUT /users/:id - Update user by ID
APP.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await Kitten.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send({ msg: "User Updated", data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

// DELETE /users/:id - Delete user by ID
APP.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await Kitten.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.status(200).send({ msg: "User Deleted From DB" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

APP.listen(4003, function () {
  console.log("App Started on port 4003");
});
