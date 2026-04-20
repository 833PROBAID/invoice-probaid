const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const MONGODB_URI = process.env.MONGODB_URI || "";

async function checkAdmin() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to MongoDB\n");

		const admin = await Admin.findOne({ username: "tony" });

		if (admin) {
			console.log("✅ Admin found in database:");
			console.log("   Username:", admin.username);
			console.log("   Email:", admin.email);
			console.log("   Role:", admin.role);
			console.log("   Active:", admin.isActive);
			console.log("   Created:", admin.createdAt);
			console.log("\n🔐 Testing password...");

			const isMatch = await admin.comparePassword("833probaidtony833probaid");
			console.log("   Password match:", isMatch ? "✅ CORRECT" : "❌ WRONG");

			if (!isMatch) {
				console.log(
					"\n⚠️  Password does not match! Creating new admin with correct password...",
				);
				await Admin.deleteOne({ username: "tony" });

				const newAdmin = new Admin({
					username: "tony",
					password: "833probaidtony833probaid",
					email: "info@833probaid.com",
					role: "superadmin",
					isActive: true,
				});
				await newAdmin.save();
				console.log("✅ New admin created successfully!");
			}
		} else {
			console.log('❌ No admin found with username "tony"');
		}
	} catch (error) {
		console.error("Error:", error.message);
	} finally {
		await mongoose.connection.close();
		process.exit(0);
	}
}

checkAdmin();
