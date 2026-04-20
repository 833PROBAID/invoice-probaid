import { Dialog, DialogBody } from "@material-tailwind/react";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { ref, push, getDatabase } from "firebase/database";
import { app } from "./firebaseConfig";

const DownloadRequestModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
		needs: [],
	});

	const [isSending, setIsSending] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleCheckboxChange = (e) => {
		const { value, checked } = e.target;
		setFormData((prevData) => {
			const newNeeds = checked
				? [...prevData.needs, value]
				: prevData.needs.filter((need) => need !== value);
			return { ...prevData, needs: newNeeds };
		});
	};

	const db = getDatabase(app);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSending) return;

		setIsSending(true);

		const pdfDownloadLink = "https://example.com/probate-guide.pdf";
		const emailHtmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #00796b;">Your Free Guide to Probate Sales</h2>
        <p>Hi <strong>${formData.firstName} ${formData.lastName}</strong>,</p>
        <p>Thank you for requesting our guide! Click the link below to download your free copy:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${pdfDownloadLink}" style="padding: 10px 20px; background-color: #00796b; color: #fff; text-decoration: none; border-radius: 4px;">
            Download Guide
          </a>
        </p>
        <p>If you have any questions or need further assistance, feel free to <a href="mailto:Info@833PROBAID.com" style="color: #00796b;">contact us</a>.</p>
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
			subject: "Your Free Guide to Probate Sales",
			htmlContent: emailHtmlContent,
		};

		try {
			// Save data to Firebase
			const dataRef = ref(db, "downloadRequests");
			await push(dataRef, formData);

			// Send email after saving to Firebase
			await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
				headers: {
					"Content-Type": "application/json",
					"api-key":
						"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",
				},
			});

			Swal.fire({
				icon: "success",
				title: "Download Request Sent",
				text: "Thank you for your request. You will receive an email with the download link shortly.",
			});

			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				message: "",
				needs: [],
			});
			localStorage.setItem("downloaded", "true");
		} catch (error) {
			console.error("Error during submission:", error);

			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to process your request. Please try again later.",
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Dialog
			open={isOpen}
			handler={onClose}
			animate={{
				mount: { scale: 1, y: 0 },
				unmount: { scale: 0.9, y: -100 },
			}}>
			<div className='relative'>
				<button
					className='absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full 
					bg-colorTeal text-white hover:bg-colorOrange hover:rotate-90 transition-all duration-300 
					shadow-md hover:shadow-lg'
					onClick={onClose}>
					<i className='fas fa-times'></i>
				</button>
			</div>
			<DialogBody className='max-h-[90vh] overflow-y-auto '>
				<div className='flex flex-col items-center mb-4'>
					<i className='fas fa-download text-6xl text-colorTeal mb-2'></i>
					<h2 className='text-xl font-bold text-center text-colorTeal mb-1'>
						Download Your Free Copy Of Our Guide To Probate Sales Now
					</h2>
					<p className='text-center text-sm text-colorOrange'>
						Please fill out the form below to request a download.
					</p>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-bold text-colorTeal mb-1'>
								First Name
							</label>
							<input
								type='text'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								placeholder='Your First Name'
								className='w-full py-1 px-2 border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal'
								required
							/>
						</div>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-bold text-colorTeal mb-1'>
								Last Name
							</label>
							<input
								type='text'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								placeholder='Your Last Name'
								className='w-full py-1 px-2 border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal'
								required
							/>
						</div>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-bold text-colorTeal mb-1'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='Your Email'
								className='w-full py-1 px-2 border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal'
								required
							/>
						</div>
						<div className='flex flex-col text-left'>
							<label className='text-sm font-bold text-colorTeal mb-1'>
								Phone
							</label>
							<input
								type='text'
								name='phone'
								value={formData.phone}
								onChange={handleChange}
								placeholder='Your Phone Number'
								className='w-full py-1 px-2 border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal'
								required
							/>
						</div>
					</div>
					<div className='flex flex-col text-left'>
						<label className='text-sm font-bold text-colorTeal mb-1'>
							Message
						</label>
						<textarea
							name='message'
							value={formData.message}
							onChange={handleChange}
							placeholder='Your Message'
							className='w-full py-1 px-2 border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal'
							rows='3'
						/>
					</div>
					<div className='flex flex-col text-left'>
						<label className='text-xl font-bold text-colorTeal mb-1'>
							What best describes your needs?
						</label>
						<div className='space-y-1'>
							{[
								"I'm Looking To Sell My Home",
								"I Need Probate Help",
								"I Need Conservatorship Help",
								"I Need Trust Help",
								"My Attorney Referred Me",
								"I Need Help Refinancing",
								"I Want To Buy A Home",
								"Other",
							].map((need) => (
								<label
									key={need}
									className='text-md flex items-center space-x-2'>
									<input
										type='checkbox'
										value={need}
										checked={formData.needs.includes(need)}
										onChange={handleCheckboxChange}
										className='form-checkbox accent-colorOrange h-4 w-4 text-colorTeal'
									/>
									<span className='text-colorTeal'>{need}</span>
								</label>
							))}
						</div>
					</div>
					<div className='flex justify-end gap-2 flex-col sm:flex-row'>
						<button
							type='submit'
							className='px-4 py-2 bg-colorTeal text-white rounded hover:bg-colorOrange'
							disabled={isSending}>
							<i className='fas fa-download mr-2'></i>
							{isSending ? "Sending..." : "Download Now"}
						</button>
						<button
							type='button'
							className='px-4 py-2 bg-colorOrange text-white rounded hover:bg-colorTeal'
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

export default DownloadRequestModal;
