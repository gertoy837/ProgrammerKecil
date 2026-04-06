const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
    res.json({ message: 'Register endpoint ready' });
}

exports.login = async (req, res) => {
    res.json({ message: 'Login endpoint ready' });
}