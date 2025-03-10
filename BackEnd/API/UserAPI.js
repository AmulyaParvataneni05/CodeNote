const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenVerify = require("../middleware/tokenVerify");
const expressAsyncHandler = require("express-async-handler");

require("dotenv").config();

userApp.use(exp.json());

userApp.get("/", tokenVerify, expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    let usersList = await usersCollection.find().toArray();
    res.json({ message: "users", payload: usersList });
}));

userApp.get("/:username", tokenVerify, expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const usernameOfUrl = req.params.username;

    let user = await usersCollection.findOne({ username: usernameOfUrl });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "one user", payload: user });
}));

userApp.post("/register", expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const { username, email, password, confirmpassword } = req.body;
    let existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmpassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    let hashedPassword = await bcryptjs.hash(password, 7);
    let newUser = {
        username,
        email,
        password: hashedPassword,
        codes: [],
    };
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "User created successfully" });
}));

userApp.post("/login", expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const { username, password } = req.body;
    let dbUser = await usersCollection.findOne({ username });
    if (!dbUser) {
        return res.status(400).json({ message: "Invalid username" });
    }
    let isMatch = await bcryptjs.compare(password, dbUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }
    let signedToken = jwt.sign({ username: dbUser.username }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token: signedToken, user: dbUser });
}));

userApp.post("/check-email", expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const { email } = req.body;

    let user = await usersCollection.findOne({ email });
    if (user) {
        let signedToken = jwt.sign({ username: user.username }, process.env.SECRET_KEY, { expiresIn: "1h" });
        return res.json({ exists: true, user: { username: user.username, email: user.email }, token: signedToken });
    }

    res.json({ exists: false });
}));

userApp.post("/update-password", expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const { username, oldPassword, newPassword } = req.body;

    let user = await usersCollection.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    await usersCollection.updateOne({ username }, { $set: { password: hashedNewPassword } });

    res.json({ message: "Password updated successfully!" });
}));

userApp.get("/codes-by-platform", expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const { platform } = req.query;

    try {
        let users = await usersCollection.find({}).toArray();
        let allCodes = users.flatMap((user) => user.codes || []);
        if (platform) {
            allCodes = allCodes.filter((code) => code.platform === platform);
        }
        res.json({ codes: allCodes });
    } catch (error) {
        console.error("Error fetching codes:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}));

module.exports = userApp;
