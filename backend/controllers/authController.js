const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

exports.register = async (req, res) => {
    res.json({ message: 'Register endpoint ready' });
}

exports.login = async (req, res) => {
    res.json({ message: 'Login endpoint ready' });
}