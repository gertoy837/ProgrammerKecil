const dataStore = require("../models/dataStore");
const { createAccessToken } = require("../lib/authToken");


exports.register = async (req, res) => {
    const result = await dataStore.registerUser(req.body);

    if (result.error) {
        return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.status(201).json({
        user: result.user,
        token: createAccessToken(result.user),
    });
};


exports.login = async (req, res) => {
    const result = await dataStore.authenticateUser(req.body);

    if (result.error) {
        return res.status(result.statusCode || 400).json({ message: result.error });
    }

    res.json({
        user: result.user,
        token: createAccessToken(result.user),
    });
};


exports.me = async (req, res) => {
    try {
        
        const result = await dataStore.getUserProfile(req.user.id);

        if (result.error) {
            return res.status(result.statusCode || 404).json({ message: result.error });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        
        const result = await dataStore.updateUserProfile(req.user.id, req.body);

        if (result.error) {
            return res.status(result.statusCode || 400).json({ message: result.error });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};