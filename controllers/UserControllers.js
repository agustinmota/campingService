const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");



async function index(req, res) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: error.message });
    }
}
async function show(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    const { username, password, email } = req.body;
    try {
        
        const user = await User.create({ username, password: await hashPassword(password), email });
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: error.message });
    }
}

async function edit(req, res) {
    const { id } = req.params;
    const { username, password, email } = req.body;
    try {
        const user = await User.findByPk(id);
        if (user) {
            user.username = username;
            user.email = email;
            if (password) {
                user.password = await hashPassword(password);
            }
            await user.save();
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: error.message });
    }
}
async function destroy(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { index, show, create, edit, destroy };
