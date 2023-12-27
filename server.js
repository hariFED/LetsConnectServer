const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();


const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});


const formDataSchema = new mongoose.Schema({
    firstName: String,
    category: String,
    LinkedIn: String,
    github: String,
});

const FormData = mongoose.model("FormData", formDataSchema);


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

        const formDataList = await FormData.find();
        res.json(formDataList);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
