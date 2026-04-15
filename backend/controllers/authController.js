const dataStore = require("../lib/dataStore");

exports.register = async (req, res) => {
    const result = await dataStore.registerUser(req.body);

    if (result.error) {
        return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.status(201).json(result);
};

exports.login = async (req, res) => {
    const result = await dataStore.authenticateUser(req.body);

    if (result.error) {
        return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.json(result);
};