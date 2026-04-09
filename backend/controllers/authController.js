const prisma = require("../lib/prisma");

exports.register = async (req, res) => {
    res.json({ message: 'Register endpoint ready' });
}

exports.login = async (req, res) => {
    res.json({ message: 'Login endpoint ready' });
}