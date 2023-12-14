const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Schema and Model
const formDataSchema = new mongoose.Schema({
    firstName: String,
    category: String,
    LinkedIn: String,
    github: String,
});

const FormData = mongoose.model("FormData", formDataSchema);

// Routes
app.post("/submitForm", async (req, res) => {
    try {
        const formData = new FormData(req.body);
        await formData.save();
        res.status(200).json({ success: true, message: "Form data saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving form data" });
    }
});

app.get('/getFormData', async (req, res) => {
    try {
        // Fetch all form data from MongoDB
        const formDataList = await FormData.find();
        res.json(formDataList);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
