const User = require("../models/User");
const hashPassword = require("../utils/hashPassword");
const { notFound, serverError } = require("../utils/httpResponses");



async function index(req, res) {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        serverError(res, error);
    }
}
async function show(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            notFound(res, "User");
        }
    } catch (error) {
        serverError(res, error);
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
        serverError(res, error);
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
            notFound(res, "User");
        }
    } catch (error) {
        serverError(res, error);
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
            notFound(res, "User");
        }
    } catch (error) {
        serverError(res, error);
    }
}

module.exports = { index, show, create, edit, destroy };
