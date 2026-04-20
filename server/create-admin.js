const mongoose = require("mongoose");
const Admin = require("./models/Admin");

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "";

async function createAdmin() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to MongoDB");

		// Check if admin already exists
		const existingAdmin = await Admin.findOne({ username: "tony" });
		if (existingAdmin) {
			console.log('Admin user "tony" already exists!');
			process.exit(0);
		}

		// Create new admin
		const admin = new Admin({
			username: "tony",
			password: "833probaidtony833probaid",
			email: "info@833probaid.com",
			role: "superadmin",
			isActive: true,
		});

		await admin.save();
		console.log("✅ Admin user created successfully!");
		console.log("Username: tony");
		console.log("Email: info@833probaid.com");
		console.log("Role: superadmin");
		console.log(
			"\n🔐 You can now login at: http://localhost:5173/invoice-login",
		);
	} catch (error) {
		console.error("Error creating admin:", error.message);
	} finally {
		await mongoose.connection.close();
		process.exit(0);
	}
}

createAdmin();
