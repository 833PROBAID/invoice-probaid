import { Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { ref, push, getDatabase } from "firebase/database";
import { app } from "./firebaseConfig";

const NewsletterModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
	});

	const [isSending, setIsSending] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const db = getDatabase(app);

	const origin = window.location.origin;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSending) return;

		setIsSending(true);

		const htmlForEmail = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="text-align: center; color: #00796b;">Thank You for Subscribing!</h2>
        <p>Hi <strong>${formData.firstName} ${formData.lastName}</strong>,</p>
        <p>We’re excited to have you on board! You'll now receive the latest updates, news, and exclusive offers directly in your inbox.</p>
        <p>Here’s a summary of your subscription:</p>
        <ul>
          <li><strong>First Name:</strong> ${formData.firstName}</li>
          <li><strong>Last Name:</strong> ${formData.lastName}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
        </ul>
        <p>If you didn’t subscribe, please ignore this email or <a href="mailto:Info@833PROBAID.com" style="color: #00796b;">contact us</a>.</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href=${origin} style="padding: 10px 20px; background-color: #00796b; color: #fff; text-decoration: none; border-radius: 4px;">Visit Our Website</a>
        </p>
        <p style="text-align: center; font-size: 12px; color: #999;">© 833PROBATE. All rights reserved.</p>
      </div>
    `;

		const emailData = {
			sender: {
				name: "833PROBATE",
				email: "Info@833PROBAID.com",
			},
			to: [
				{
					email: formData.email,
					name: `${formData.firstName} ${formData.lastName}`,
				},
			],
			subject: "Welcome to Our Newsletter!",
			htmlContent: htmlForEmail,
		};

		try {
			// Save data to Firebase
			const dataRef = ref(db, "subscribers");
			await push(dataRef, formData);

			const response = await axios.post(
				"https://api.brevo.com/v3/smtp/email",
				emailData,
				{
					headers: {
						"Content-Type": "application/json",
						"api-key":
							"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",
					},
				},
			);

			console.log("Email sent:", response.data);

			Swal.fire({
				icon: "success",
				title: "Subscription Successful",
				text: "Thank you for subscribing! You'll receive our latest updates via email.",
			});
			localStorage.setItem("subscribed", "true");

			setFormData({ firstName: "", lastName: "", email: "" });
		} catch (error) {
			console.error("Error sending email:", error);

			Swal.fire({
				icon: "error",
				title: "Email Failed",
				text: "An error occurred while sending your subscription confirmation. Please try again later.",
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			handler={onClose}
			size='sm'
			animate={{
				mount: { scale: 1, y: 0 },
				unmount: { scale: 0.9, y: -100 },
			}}>
			<DialogBody className='max-h-screen overflow-y-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg'>
				<form onSubmit={handleSubmit} className='space-y-4 text-gray-800'>
					<div className='flex flex-col items-center mb-4'>
						<i className='fas fa-envelope text-6xl text-colorTeal mb-2'></i>
						<h2 className='text-2xl font-bold text-center text-colorTeal mb-1'>
							Subscribe to Our Newsletter
						</h2>
						<p className='text-center text-sm text-colorOrange'>
							Stay updated with the latest news and exclusive offers.
						</p>
					</div>
					<div className='space-y-3'>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-semibold text-colorTeal mb-1'>
								First Name
							</label>
							<input
								type='text'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								placeholder='Enter your first name'
								className='w-full px-4 py-2 border-2 border-colorOrange rounded focus:outline-none transition duration-200'
								required
							/>
						</div>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-semibold text-colorTeal mb-1'>
								Last Name
							</label>
							<input
								type='text'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								placeholder='Enter your last name'
								className='w-full px-4 py-2 border-2 border-colorOrange rounded focus:outline-none transition duration-200'
								required
							/>
						</div>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-semibold text-colorTeal mb-1'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Enter your email address'
								className='w-full px-4 py-2 border-2 border-colorOrange rounded focus:outline-none transition duration-200'
								required
							/>
						</div>
					</div>
					<div className='flex justify-end gap-2 mt-6 flex-col sm:flex-row'>
						<button
							type='submit'
							className='w-full sm:w-auto px-6 py-2 bg-colorTeal text-white rounded-lg hover:bg-colorOrange transition duration-200 shadow-sm flex items-center justify-center'
							disabled={isSending}>
							<i className='fas fa-envelope mr-2'></i>
							{isSending ? "Sending..." : "Subscribe Now"}
						</button>
						<button
							type='button'
							className='w-full sm:w-auto px-6 py-2 bg-colorOrange text-white rounded-lg hover:bg-gray-400 transition duration-200 shadow-sm flex items-center justify-center'
							onClick={onClose}>
							<i className='fas fa-times mr-2'></i>
							Cancel
						</button>
					</div>
				</form>
			</DialogBody>
		</Dialog>
	);
};

export default NewsletterModal;
