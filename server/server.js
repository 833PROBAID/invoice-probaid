const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
	.connect(process.env.MONGODB_URI || "")
	.then(() => console.log("MongoDB connected successfully"))
	.catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/quiz", require("./routes/quiz"));

// Health check route
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
