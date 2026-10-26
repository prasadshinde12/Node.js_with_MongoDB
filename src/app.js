
import express from "express";
import dbConnect from "../config/db.js";
import mongoose from "mongoose";

const APP = express();

APP.use(express.json());

// Connect to MongoDB
dbConnect()
    .then(function () {
        console.log("Database connected");
    })
    .catch(function (err) {
        console.log("Database connection failed", err);
    });

// Schema for users collection
const kittySchema = new mongoose.Schema({
    name: String,
    age: Number,
    place: String
});

// Explicitly use the "users" collection
const kitten = mongoose.model("User", kittySchema, "users");

// GET: Display all users
APP.get("/users", async function (req, res) {
    try {
        let result = await kitten.find();
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST: Insert a new user
APP.post("/users", async function (req, res) {
    try {
        await kitten.create(req.body);
        res.status(201).send({"msg": "User created successfully"});
    } catch (err) {
       console.log(err);
       res.status(403).send({"msg": "Failed to create user"});
    }
});

// PUT: Update a user by ID
APP.put("/users/:id", async function (req, res) {
    try {
        let result = await kitten.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).send("User not found");
        }

        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE: Delete a user by ID
APP.delete("/users/:id", async function (req, res) {
    try {
        let result = await kitten.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).send("User not found");
        }

        res.status(200).send("User deleted successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start server
APP.listen(4004, function () {
    console.log("App Started on port 4004");
});
