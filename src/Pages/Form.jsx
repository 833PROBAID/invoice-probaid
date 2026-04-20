import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import Swal from "sweetalert2";
import { Typography } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
	Checkbox,
	TextInput,
	FileUpload,
	RadioButton,
	RadioGroup,
	FormSection,
	renderLabel,
} from "../Components/SharedComponents";

const Form = () => {
	const [formData, setFormData] = useState({
		// Referring Party Info
		referringPartyName: "",
		role: "",
		roleOther: "",
		firmName: "",
		referringEmail: "",
		referringPhone: "",
		preferredContact: "",
		attorneyName: "",
		attorneyEmail: "",

		// Client/Representative Details
		clientName: "",
		clientRole: "",
		clientRoleOther: "",
		lettersIssued: "",
		lettersDate: "",
		lettersExpectedDate: "",
		caseNumber: "",
		courthouse: "",

		// Property Information
		propertyAddress: "",
		occupancyStatus: "",
		multipleProperties: "",
		additionalAddresses: "",
		accessRestrictions: "",
		accessRestrictionsDetails: "",
		urgency: "",
		urgencyDetails: "",

		//extra property info
		exportedProperties: [
			{
				address: "",
				occupancyStatus: "",
				multipleProperties: "",
				additionalAddresses: "",
				accessRestrictions: "",
				accessRestrictionsDetails: "",
				urgency: "",
				urgencyDetails: "",
			},
		],

		// Case Type
		caseType: {
			probate: false,
			fullAuthority: false,
			limitedAuthority: false,
			conservatorship: false,
			ofTheState: false,
			ofThePerson: false,
			both: false,
			trustSale: false,
			reverseMortgage: false,
			notSure: false,
		},

		// Requested Support
		requestedSupport: {
			contactClient: false,
			waitForIntro: false,
			provideOpinion: false,
			refereeAssigned: false,
			conductWalkthrough: false,
			preparePhotos: false,
			willOrderPrivateAppraisal: "",
			coordinateVendors: false,
			notReadyForListing: false,
		},

		// Document Upload
		documentUpload: {
			lettersOfAdministration: false,
			lettersOfConservatorship: false,
			trustCertification: false,
			recordedDeed: false,
			courtMinuteOrder: false,
			relevantFilings: false,
		},
		uploadedFiles: [],

		// How Did You Hear About
		howDidYouHear: "",
		howDidYouHearOther: "",
	});
	const [isSendingEmail, setIsSendingEmail] = useState(false);

	// Handler for main form fields
	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const group = e.target.dataset.group;

		if (name === "multipleProperties") {
			setFormData((prev) => {
				let newExportedProperties = prev.exportedProperties;
				if (value === "Yes") {
					// Add a new property if only one exists
					if (prev.exportedProperties.length === 1) {
						newExportedProperties = [
							...prev.exportedProperties,
							{
								address: "",
								occupancyStatus: "",
								multipleProperties: "",
								additionalAddresses: "",
								accessRestrictions: "",
								accessRestrictionsDetails: "",
								urgency: "",
								urgencyDetails: "",
							},
						];
					}
				} else if (value === "No") {
					// Keep only the first property
					newExportedProperties = [prev.exportedProperties[0]];
				}
				return {
					...prev,
					multipleProperties: value,
					exportedProperties: newExportedProperties,
				};
			});
			return;
		}

		if (type === "checkbox") {
			if (group) {
				setFormData((prev) => ({
					...prev,
					[group]: {
						...prev[group],
						[name]: checked,
					},
				}));
			} else {
				setFormData((prev) => ({ ...prev, [name]: checked }));
			}
		} else {
			// Special handling for the 'howDidYouHear' radio: focus the 'Other' input when selected and clear it when not
			if (name === "howDidYouHear") {
				setFormData((prev) => ({
					...prev,
					howDidYouHear: value,
					howDidYouHearOther: value === "Other" ? prev.howDidYouHearOther : "",
				}));
				if (value === "Other") {
					setTimeout(() => howDidYouHearOtherRef.current?.focus(), 0);
				}
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: value,
				}));
			}
		}
	};

	// Handler for property fields in exportedProperties
	const handlePropertyChange = (index, e) => {
		const { name, value, type, checked } = e.target;
		if (name === "multipleProperties") {
			setFormData((prev) => {
				let updatedProperties = prev.exportedProperties.map((property, i) => {
					if (i !== index) return property;
					return { ...property, [name]: value };
				});

				if (value === "Yes") {
					// Only add if this is the last property
					if (index === updatedProperties.length - 1) {
						updatedProperties = [
							...updatedProperties,
							{
								address: "",
								occupancyStatus: "",
								multipleProperties: "",
								additionalAddresses: "",
								accessRestrictions: "",
								accessRestrictionsDetails: "",
								urgency: "",
								urgencyDetails: "",
							},
						];
					}
				} else if (value === "No") {
					// Remove all properties after this one
					updatedProperties = updatedProperties.slice(0, index + 1);
				}
				return {
					...prev,
					exportedProperties: updatedProperties,
				};
			});
			return;
		}

		setFormData((prev) => {
			const updatedProperties = prev.exportedProperties.map((property, i) => {
				if (i !== index) return property;
				if (type === "checkbox") {
					return { ...property, [name]: checked };
				}
				// If changing accessRestrictions to No or Not Sure, clear the details
				if (
					name === "accessRestrictions" &&
					(value === "No" || value === "Not Sure")
				) {
					return { ...property, [name]: value, accessRestrictionsDetails: "" };
				}
				// If changing urgency to No or Not Sure, clear the urgency details
				if (name === "urgency" && (value === "No" || value === "Not Sure")) {
					return { ...property, [name]: value, urgencyDetails: "" };
				}
				return { ...property, [name]: value };
			});
			return { ...prev, exportedProperties: updatedProperties };
		});

		// If the user selected Yes for accessRestrictions, focus the details input (for any index)
		if (name === "accessRestrictions" && value === "Yes") {
			setTimeout(() => {
				const ref = accessRestrictionsDetailsRefs.current[index];
				if (ref && typeof ref.focus === "function") ref.focus();
			}, 0);
		}

		// If the user selected Yes for urgency, focus the details input (for any index)
		if (name === "urgency" && value === "Yes") {
			setTimeout(() => {
				const ref = urgencyDetailsRefs.current[index];
				if (ref && typeof ref.focus === "function") ref.focus();
			}, 0);
		}
	};

	const printRef = useRef();
	const accessRestrictionsDetailsRef0 = useRef(null);
	const accessRestrictionsDetailsRefs = useRef({});
	const urgencyDetailsRef0 = useRef(null);
	const urgencyDetailsRefs = useRef({});
	const howDidYouHearOtherRef = useRef(null);

	// Zoom control state
	const [zoomLevel, setZoomLevel] = useState(1);
	const formContainerRef = useRef(null);

	const handleSendPdfByEmail = async () => {
		if (isSendingEmail) return;
		if (!formData.referringEmail) {
			Swal.fire({
				icon: "error",
				title: "Email Required",
				text: "Please enter your email address in the form before submitting.",
			});
			return;
		}

		setIsSendingEmail(true);
		const divId = "printable-content";
		const fileName = "ReferralForm";
		const content = document.getElementById(divId);

		if (!content) {
			console.error(`Div with ID ${divId} not found`);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Could not find form content to generate PDF.",
			});
			setIsSendingEmail(false);
			return;
		}

		const currentScrollX = window.scrollX;
		const currentScrollY = window.scrollY;

		try {
			if (document.fonts) {
				await document.fonts.ready;
			}
			await new Promise((resolve) => setTimeout(resolve, 200));
			window.scrollTo(0, 0);

			const canvas = await html2canvas(content, {
				scale: 1.5,
				useCORS: true,
				allowTaint: true,
				logging: false,
				backgroundColor:
					window.getComputedStyle(content).backgroundColor || "#ffffff",
				letterRendering: true,
				scrollX: -currentScrollX,
				scrollY: -currentScrollY,
				width: content.scrollWidth,
				height: content.scrollHeight,
				windowWidth: content.scrollWidth,
				windowHeight: content.scrollHeight,
			});

			const imgData = canvas.toDataURL("image/jpeg", 0.8);
			const pxToMmRatio = 25.4 / 96;
			const pdfWidthMm = canvas.width * pxToMmRatio;
			const pdfHeightMm = canvas.height * pxToMmRatio;

			const pdf = new jsPDF({
				orientation: pdfWidthMm > pdfHeightMm ? "l" : "p",
				unit: "mm",
				format: [pdfWidthMm, pdfHeightMm],
			});

			pdf.addImage(imgData, "JPEG", 0, 0, pdfWidthMm, pdfHeightMm);
			const pdfBase64 = pdf.output("datauristring").split(",")[1];

			const attachments = [
				{
					name: `${fileName}.pdf`,
					content: pdfBase64,
				},
			];

			const fileToBase64 = (file) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(file);
					reader.onload = () => resolve(reader.result.split(",")[1]);
					reader.onerror = (error) => reject(error);
				});

			// Process uploaded files
			if (formData.uploadedFiles.length > 0) {
				for (const file of formData.uploadedFiles) {
					try {
						const fileBase64 = await fileToBase64(file);
						attachments.push({
							name: file.name,
							content: fileBase64,
						});
					} catch (error) {
						console.error(`Error converting ${file.name} to base64:`, error);
					}
				}
			}

			const emailHtmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #00796b;">Referral Form Submission</h2>
          <p>Hi <strong>${
						formData.referringPartyName || "Referrer"
					}</strong>,</p>
          <p>Thank you for submitting your Referral Form. Please find the PDF copy of your submission attached to this email.</p>
          <p>If you have any questions, feel free to <a href="mailto:Info@833PROBAID.com" style="color: #00796b;">contact us</a>.</p>
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
						email: formData.referringEmail,
						name: formData.referringPartyName || "Referrer",
					},
				],
				subject: "Your Referral Form Submission",
				htmlContent: emailHtmlContent,
				attachment: attachments,
			};

			await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
				headers: {
					"Content-Type": "application/json",
					"api-key":
						"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",
				},
			});

			Swal.fire({
				icon: "success",
				title: "Submission Received",
				text: "Thank you—your referral has been received. I’ll begin reviewing the case immediately and will reach out to you or your client based on your instructions. You’ll be notified once the next step is in motion. Everything will be tracked, documented, and moved forward without friction.",
			});
		} catch (error) {
			console.error("Error sending PDF by email:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to send the PDF by email. Please try again later or download the form manually if the issue persists.",
			});
		} finally {
			window.scrollTo(currentScrollX, currentScrollY);
			setIsSendingEmail(false);
		}
	};

	// Handler for file uploads
	const handleFileChange = (e) => {
		const { files } = e.target;
		if (files && files.length > 0) {
			setFormData((prev) => ({
				...prev,
				uploadedFiles: [...prev.uploadedFiles, ...Array.from(files)],
			}));
		}
	};

	// Zoom control functions
	const handleZoomIn = () => {
		setZoomLevel((prev) => Math.min(prev + 0.1, 2));
	};

	const handleZoomOut = () => {
		setZoomLevel((prev) => Math.max(prev - 0.1, 0.25));
	};

	const handleFitToScreen = () => {
		if (formContainerRef.current) {
			const containerWidth = formContainerRef.current.offsetWidth;
			const formWidth = 1280;
			const fitZoom = containerWidth / formWidth;
			setZoomLevel(Math.min(fitZoom, 1));
		}
	};

	useEffect(() => {
		setTimeout(() => {
			handleFitToScreen();
		}, 700);
	}, []);

	const handleResetZoom = () => {
		setZoomLevel(1);
	};

	return (
		<div className='w-full' ref={formContainerRef}>
			{/* Zoom Controls */}
			<div className='sticky top-4 z-50 flex justify-center mb-4'>
				<div className='bg-white border-2 border-[#0097A7] rounded-lg shadow-lg px-4 py-2 flex items-center gap-3'>
					<button
						type='button'
						onClick={handleZoomOut}
						disabled={zoomLevel <= 0.25}
						className='px-3 py-1 bg-[#0097A7] text-white rounded hover:bg-[#007A87] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						title='Zoom Out'>
						<i className='fas fa-search-minus'></i>
					</button>
					<span className='text-sm font-semibold text-[#0097A7] min-w-[60px] text-center'>
						{Math.round(zoomLevel * 100)}%
					</span>
					<button
						type='button'
						onClick={handleZoomIn}
						disabled={zoomLevel >= 2}
						className='px-3 py-1 bg-[#0097A7] text-white rounded hover:bg-[#007A87] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
						title='Zoom In'>
						<i className='fas fa-search-plus'></i>
					</button>
					<div className='w-px h-6 bg-gray-300'></div>
					<button
						type='button'
						onClick={handleFitToScreen}
						className='px-3 py-1 bg-[#FD7702] text-white rounded hover:bg-[#E56902] transition-colors'
						title='Fit to Screen'>
						<i className='fas fa-compress-alt'></i>
					</button>
					<button
						type='button'
						onClick={handleResetZoom}
						className='px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
						title='Reset Zoom (100%)'>
						<i className='fas fa-undo'></i>
					</button>
				</div>
			</div>

			<div className='large-div'>
				<div
					ref={printRef}
					className='large-div-content'
					style={{
						transform: `scale(${zoomLevel})`,
						transformOrigin: "top center",
						transition: "transform 0.2s ease",
						marginBottom: printRef.current
							? `${printRef.current.offsetHeight * (1 - zoomLevel)}px`
							: 0,
					}}>
					<div
						className='flex items-center justify-center w-full'
						id='printable-content'>
						<div
							className='w-full bg-white border border-gray-200 shadow-md form-canvas'
							style={{ margin: "0 auto" }}>
							<div className='w-full bg-[#0097A7]'>
								<div className='grid grid-cols-7 justify-center items-stretch py-8'>
									<div className='col-span-3 bg-white pr-12 py-2 pl-4 flex items-center'>
										<img
											src='/833PROBAID.png'
											alt=''
											className='w-full h-auto'
										/>
									</div>
									<div className='bg-[#FD7702] -ml-9 border-[21px] border-r-0 border-[#0097A7] text-white px-6 py-4 font-bold text-[3.7rem] uppercase col-span-4 rounded-l-full flex items-center justify-center'>
										Referral Form
									</div>
								</div>
							</div>

							<form className='relative mt-4 mx-1 px-1 mx-5'>
								<div className='absolute left-2 top-10 bottom-10 w-[6px] bg-[#FD7702]'></div>

								{/* Referring Party Info */}
								<FormSection title='Referring Party Info' icon='fa-user'>
									<TextInput
										name='referringPartyName'
										value={formData.referringPartyName}
										onChange={handleChange}
										label='Your Full Name:'
										width='full'
										required
									/>

									<div>
										<RadioGroup
											name='role'
											value={formData.role}
											onChange={handleChange}
											label='Your Role:'
											options={[
												{
													value: "Attorney",
													label: "Attorney",
													color: "teal",
													width: "140px",
												},
												{
													value: "Paralegal",
													label: "Paralegal",
													color: "orange",
													width: "140px",
												},
												{
													value: "Professional Fiduciary",
													label: "Professional Fiduciary (P.F.B.)",
													color: "teal",
													width: "300px",
												},
												{
													value: "Other",
													label: "Other",
													color: "orange",
													width: "100px",
												},
											]}
											width='full'
											containerClass='w-full flex justify-between'
										/>
										{formData.role === "Other" && (
											<TextInput
												name='roleOther'
												value={formData.roleOther}
												onChange={handleChange}
												width='400px'
												containerClass='mt-2'
											/>
										)}
									</div>

									<TextInput
										name='firmName'
										value={formData.firmName}
										onChange={handleChange}
										label='Your Firm / Agency Name:'
										placeholder='If none, write "N/A" or describe your connection - e.g., friend, neighbor, church, etc.'
										inputClass='placeholder:italic placeholder-[#FD7702]'
										width='full'
									/>

									<div className='flex gap-4 w-full'>
										<TextInput
											name='referringEmail'
											value={formData.referringEmail}
											onChange={handleChange}
											label='Your Email:'
											type='email'
											width='50%'
											required
										/>

										<TextInput
											name='referringPhone'
											value={formData.referringPhone}
											onChange={handleChange}
											label='Your Phone:'
											width='50%'
										/>
									</div>

									<RadioGroup
										name='preferredContact'
										value={formData.preferredContact}
										onChange={handleChange}
										label='Your Preferred Method of Contact:'
										options={[
											{
												value: "Call",
												label: "Call",
												color: "teal",
												width: "100px",
											},
											{
												value: "Email",
												label: "Email",
												color: "orange",
												width: "100px",
											},
											{
												value: "Text",
												label: "Text",
												color: "teal",
												width: "100px",
											},
										]}
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>

									<div className='pt-3 font-bold'>
										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
											If submitted by a Paralegal or Assistant (If none, write
											"N/A" or "Not Yet Assigned")
										</div>
										<TextInput
											name='attorneyName'
											value={formData.attorneyName}
											onChange={handleChange}
											label="Attorney of Record's Full Name:"
										/>
										<TextInput
											name='attorneyEmail'
											value={formData.attorneyEmail}
											onChange={handleChange}
											label="Attorney's Email (If Different):"
											type='email'
											containerClass='mt-3'
										/>
										<div
											className='bg-gray-100 p-3 mt-3 italic space-y-2'
											style={{
												lineHeight: "1.5",
											}}>
											<p className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic uppercase'>
												Not an attorney? &nbsp; Not a problem.
											</p>
											<p>
												This Form Can Be Submitted by Any Trusted Party Helping
												the Estate Move Forward — No License Required.
											</p>
											<p>
												Or call{" "}
												<span className='text-[#0097A7] font-bold'>
													(833) PROBAID
												</span>{" "}
												— that's{" "}
												<span className='text-[#0097A7] font-bold not-italic'>
													(833) 776-2243
												</span>{" "}
												— and Speak With Me Directly.
											</p>
											<div className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic uppercase'>
												- Your Referral Could Make All the Difference for
												Someone Navigating a Difficult Chapter. Thank You for
												Stepping In.
											</div>
										</div>
									</div>
								</FormSection>
								{/* Case Type */}
								<FormSection title='Case Type' icon='fa-gavel'>
									<div className='flex justify-start gap-2 w-full'>
										<div className='w-[575px]'>
											<Checkbox
												name='probate'
												group='caseType'
												label='Probate'
												checked={formData.caseType.probate}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															probate: e.target.checked,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustSale: false,
															reverseMortgage: false,
															successorInInterest: false,
														},
													});
												}}
											/>
										</div>
										<div className='flex gap-4'>
											<Checkbox
												name='fullAuthority'
												group='caseType'
												label='Full Authority'
												checked={formData.caseType.fullAuthority}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															fullAuthority: e.target.checked,
															limitedAuthority: false,
															probate: true,
															conservatorship: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
															trustSale: false,
														},
													});
												}}
												width='160px'
											/>
											<Checkbox
												name='limitedAuthority'
												group='caseType'
												label='Limited Authority (With Court Confirmation)'
												checked={formData.caseType.limitedAuthority}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															limitedAuthority: e.target.checked,
															fullAuthority: false,
															probate: true,
															conservatorship: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
															trustSale: false,
														},
													});
												}}
												width='400px'
											/>
										</div>
									</div>
									<div className='flex justify-start gap-2 w-full'>
										<div className='w-[575px]'>
											<Checkbox
												name='conservatorship'
												group='caseType'
												label='Conservatorship'
												checked={formData.caseType.conservatorship}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															conservatorship: e.target.checked,
															probate: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
															trustSale: false,
														},
														documentUpload: {
															...formData.documentUpload,
															lettersOfConservatorship: e.target.checked,
														},
													});
												}}
												width='180px'
											/>
										</div>
										<div className='flex gap-4'>
											<Checkbox
												name='ofTheEstate'
												group='caseType'
												label='Of the Estate'
												checked={formData.caseType.ofTheEstate}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															ofTheEstate: e.target.checked,
															ofThePerson: false,
															both: false,
															probate: false,
															conservatorship: true,
															fullAuthority: false,
															limitedAuthority: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
															trustSale: false,
														},
														documentUpload: {
															...formData.documentUpload,
															lettersOfConservatorship: e.target.checked,
														},
													});
												}}
												width='160px'
											/>
											<Checkbox
												name='ofThePerson'
												group='caseType'
												label='Of the Person'
												checked={formData.caseType.ofThePerson}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															ofThePerson: e.target.checked,
															ofTheEstate: false,
															both: false,
															probate: false,
															conservatorship: true,
															fullAuthority: false,
															limitedAuthority: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
															trustSale: false,
														},
														documentUpload: {
															...formData.documentUpload,
															lettersOfConservatorship: e.target.checked,
														},
													});
												}}
												width='170px'
											/>
											<Checkbox
												name='both'
												group='caseType'
												label='Both'
												checked={formData.caseType.both}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															both: e.target.checked,
															ofThePerson: true,
															ofTheEstate: true,
															probate: false,
															conservatorship: true,
															fullAuthority: false,
															limitedAuthority: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
															trustSale: false,
														},
														documentUpload: {
															...formData.documentUpload,
															lettersOfConservatorship: e.target.checked,
														},
													});
												}}
												width='150px'
											/>
										</div>
									</div>
									<div className='flex justify-start gap-2 w-full'>
										<div className='w-[575px]'>
											<Checkbox
												name='trustSale'
												group='caseType'
												label='Trust Sale'
												checked={formData.caseType.trustSale}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															trustSale: e.target.checked,
															probate: false,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustee: false,
															successorTrustee: false,
															reverseMortgage: false,
															successorInInterest: false,
														},
														documentUpload: {
															...formData.documentUpload,
															trustCertification: e.target.checked,
														},
													});
												}}
												width='200px'
											/>
										</div>
										<div className='flex gap-2'>
											<Checkbox
												name='trustee'
												group='caseType'
												label='Trustee'
												checked={formData.caseType.trustee}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															trustee: e.target.checked,
															successorTrustee: false,
															probate: false,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustSale: true,
															reverseMortgage: false,
															successorInInterest: false,
														},
														documentUpload: {
															...formData.documentUpload,
															trustCertification: e.target.checked,
														},
													});
												}}
												width='168px'
											/>
											<Checkbox
												name='successorTrustee'
												group='caseType'
												label='Successor Trustee'
												checked={formData.caseType.successorTrustee}
												onChange={(e) => {
													setFormData({
														...formData,
														caseType: {
															...formData.caseType,
															successorTrustee: e.target.checked,
															probate: false,
															conservatorship: false,
															fullAuthority: false,
															limitedAuthority: false,
															ofTheEstate: false,
															ofThePerson: false,
															both: false,
															trustSale: true,
															trustee: false,
															reverseMortgage: false,
															successorInInterest: false,
														},
														documentUpload: {
															...formData.documentUpload,
															trustCertification: e.target.checked,
														},
													});
												}}
												width='250px'
											/>
										</div>
									</div>
									<div className='flex justify-start gap-2 w-full'>
										<Checkbox
											name='reverseMortgage'
											group='caseType'
											label='Reverse Mortgage'
											checked={formData.caseType.reverseMortgage}
											onChange={(e) => {
												setFormData({
													...formData,
													caseType: {
														...formData.caseType,
														reverseMortgage: e.target.checked,
														probate: false,
														conservatorship: false,
														fullAuthority: false,
														limitedAuthority: false,
														ofTheEstate: false,
														ofThePerson: false,
														both: false,
														trustSale: false,
														trustee: false,
														successorTrustee: false,
														successorInInterest: false,
													},
												});
											}}
											width='220px'
										/>
									</div>
									<div className='flex justify-start gap-2 w-full'>
										<Checkbox
											name='successorInInterest'
											group='caseType'
											label='Successor in Interest'
											checked={formData.caseType.successorInInterest}
											onChange={(e) => {
												setFormData({
													...formData,
													caseType: {
														...formData.caseType,
														successorInInterest: e.target.checked,
														probate: false,
														conservatorship: false,
														fullAuthority: false,
														limitedAuthority: false,
														ofTheEstate: false,
														ofThePerson: false,
														both: false,
														trustSale: false,
														trustee: false,
														successorTrustee: false,
														reverseMortgage: false,
													},
												});
											}}
											width='240px'
										/>
									</div>
								</FormSection>

								{/* Client/Representative Details */}
								<FormSection
									title='Client / Representative Details'
									icon='fa-user-tie'>
									<TextInput
										name='clientName'
										value={formData.clientName}
										onChange={handleChange}
										label='Full Name:'
										width='full'
										required
									/>

									<RadioGroup
										name='clientRole'
										value={formData.clientRole}
										onChange={handleChange}
										label='Role in the Case:'
										options={[
											{
												value: "Executor",
												label: "Executor",
												color: "teal",
												width: "140px",
											},
											{
												value: "Administrator",
												label: "Administrator",
												color: "orange",
												width: "180px",
											},
											{
												value: "Conservator",
												label: "Conservator",
												color: "teal",
												width: "160px",
											},
											{
												value: "Trustee",
												label: "Trustee",
												color: "orange",
												width: "120px",
											},
											{
												value: "Other",
												label: "Other",
												color: "teal",
												width: "100px",
											},
										]}
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>

									<div className='flex justify-between items-center'>
										<label className='block font-bold text-base'>
											Has the Court Issued Letters Yet?
										</label>
										<div className='flex flex-col gap-3 items-end'>
											<div className='flex items-center gap-4'>
												<RadioGroup
													name='lettersIssued'
													value={formData.lettersIssued}
													onChange={handleChange}
													options={[
														{
															value: "Yes",
															label: "Yes",
															color: "teal",
															width: "80px",
														},
														{
															value: "No",
															label: "No ",
															color: "orange",
															width: "80px",
														},
													]}
													width='auto'
													gap='gap-4'
													direction='horizontal'
												/>
												<div className='flex justify-center items-center'>
													<label className='font-bold mr-1'>
														{renderLabel("Issued On:")}
													</label>
													<DatePicker
														selected={
															formData.lettersDate
																? new Date(formData.lettersDate)
																: null
														}
														onChange={(date) => {
															const event = {
																target: {
																	name: "lettersDate",
																	value: date
																		? date.toISOString().split("T")[0]
																		: "",
																},
															};
															handleChange(event);
														}}
														className='border-[3px] border-[#0097A7] px-2 py-1 bg-gray-200 placeholder:italic placeholder-[#FD7702] w-[240px]'
														placeholderText='Select date'
														dateFormat='yyyy-MM-dd'
													/>
												</div>
												<div className='flex justify-center items-center'>
													<label className='font-bold mr-1'>
														{renderLabel("Expected By:")}
													</label>
													<DatePicker
														selected={
															formData.lettersExpectedDate
																? new Date(formData.lettersExpectedDate)
																: null
														}
														onChange={(date) => {
															const event = {
																target: {
																	name: "lettersExpectedDate",
																	value: date
																		? date.toISOString().split("T")[0]
																		: "",
																},
															};
															handleChange(event);
														}}
														className='border-[3px] border-[#0097A7] px-2 py-1 bg-gray-200 placeholder:italic placeholder-[#FD7702] w-[230px]'
														placeholderText='Select date'
														dateFormat='yyyy-MM-dd'
													/>
												</div>
											</div>
										</div>
									</div>

									<TextInput
										name='caseNumber'
										value={formData.caseNumber}
										onChange={handleChange}
										label='Case Number (If Available):'
										width='full'
									/>

									<TextInput
										name='courthouse'
										value={formData.courthouse}
										onChange={handleChange}
										label='Courthouse Handling File:'
										width='full'
									/>
								</FormSection>

								{/* Property Information */}
								<FormSection
									title={`${
										formData.exportedProperties?.length > 1 ? "1 - " : ""
									}Property Information`}
									icon='fa-home'>
									<TextInput
										name='address'
										value={formData.exportedProperties[0]?.address || ""}
										onChange={(e) => handlePropertyChange(0, e)}
										label='Full Property Address:'
										width='full'
										required
									/>

									<RadioGroup
										name='occupancyStatus'
										value={
											formData.exportedProperties[0]?.occupancyStatus || ""
										}
										onChange={(e) => handlePropertyChange(0, e)}
										label='Occupancy Status:'
										options={[
											{
												value: "Vacant",
												label: "Vacant",
												color: "teal",
												width: "110px",
											},
											{
												value: "Tenant",
												label: "Tenant",
												color: "orange",
												width: "110px",
											},
											{
												value: "Family Member",
												label: "Family Member",
												color: "teal",
												width: "177px",
											},
											{
												value: "Unauthorized Occupant/Squatter",
												label: "Unauthorized Occupant / Squatter",
												color: "orange",
												width: "330px",
											},
											{
												value: "Unknown",
												label: "Unknown",
												color: "teal",
												width: "130px",
											},
										]}
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>

									<div className='flex items-center justify-between w-full'>
										<label
											className='block font-bold text-base flex-shrink-0'
											style={{ minWidth: "35%" }}>
											Any Known Access Restrictions, Hostility, or Safety
											Concerns?
										</label>
										<div className='flex gap-4 justify-end items-center flex-1 w-full'>
											<div className='flex gap-4'>
												<RadioButton
													name='accessRestrictions'
													value='Yes'
													selectedValue={
														formData.exportedProperties[0]
															?.accessRestrictions || ""
													}
													onChange={(e) => handlePropertyChange(0, e)}
													label='Yes'
													color='teal'
													width='70px'
												/>
												<TextInput
													ref={(el) => {
														accessRestrictionsDetailsRef0.current = el;
														accessRestrictionsDetailsRefs.current[0] = el;
													}}
													name='accessRestrictionsDetails'
													value={
														formData.exportedProperties[0]
															?.accessRestrictionsDetails || ""
													}
													onChange={(e) => handlePropertyChange(0, e)}
													label='Please Describe:'
													containerClass='w-full max-w-none'
													inputClass='placeholder:italic placeholder-[#FD7702]'
													width='340px'
												/>
											</div>
											<RadioGroup
												name='accessRestrictions'
												value={
													formData.exportedProperties[0]?.accessRestrictions ||
													""
												}
												onChange={(e) => handlePropertyChange(0, e)}
												options={[
													{
														value: "No",
														label: "No ",
														color: "orange",
														width: "80px",
													},
													{
														value: "Not Sure",
														label: "Not Sure",
														color: "teal",
														width: "130px",
													},
												]}
												width='auto'
											/>
										</div>
									</div>
									<div className='flex items-center justify-between w-full gap-2'>
										<label
											className='block font-bold text-base flex-shrink-0'
											style={{ minWidth: "35%" }}>
											Any Urgency, Deadlines, or Court Pressure to List or Sell?
										</label>
										<div className='flex gap-4 justify-end items-center flex-1 w-full'>
											<div className='flex gap-4'>
												<RadioButton
													name='urgency'
													value='Yes'
													selectedValue={
														formData.exportedProperties[0]?.urgency || ""
													}
													onChange={(e) => handlePropertyChange(0, e)}
													label='Yes'
													color='teal'
													width='143px'
												/>
												<TextInput
													ref={(el) => {
														urgencyDetailsRef0.current = el;
														urgencyDetailsRefs.current[0] = el;
													}}
													name='urgencyDetails'
													value={
														formData.exportedProperties[0]?.urgencyDetails || ""
													}
													onChange={(e) => handlePropertyChange(0, e)}
													label='Details:'
													containerClass='w-full max-w-none'
													inputClass='placeholder:italic placeholder-[#FD7702]'
													width='267px'
												/>
											</div>
											<RadioGroup
												name='urgency'
												value={formData.exportedProperties[0]?.urgency || ""}
												onChange={(e) => handlePropertyChange(0, e)}
												options={[
													{
														value: "No",
														label: "No ",
														color: "orange",
														width: "80px",
													},
													{
														value: "Not Sure",
														label: "Not Sure",
														color: "teal",
														width: "130px",
													},
												]}
												width='auto'
											/>
										</div>
									</div>

									<RadioGroup
										name='multipleProperties'
										value={formData.multipleProperties}
										onChange={handleChange}
										label='Multiple Properties?'
										options={[
											{
												value: "Yes",
												label: "Yes – Details Below",
												color: "teal",
												width: "200px",
											},
											{
												value: "No",
												label: "No ",
												color: "orange",
												width: "130px",
											},
										]}
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>
								</FormSection>

								{/* Extra Property Info */}
								{formData.multipleProperties === "Yes" && (
									<div className='mb-0'>
										{formData.exportedProperties
											.slice(1)
											.map((property, index) => (
												<FormSection
													key={index + 1}
													title={`${index + 2} - Property Information`}
													icon='fa-home'>
													<TextInput
														name='address'
														value={property.address}
														onChange={(e) => handlePropertyChange(index + 1, e)}
														label='Full Property Address:'
														width='full'
														required
													/>
													<RadioGroup
														name='occupancyStatus'
														value={property.occupancyStatus || ""}
														onChange={(e) => handlePropertyChange(index + 1, e)}
														label='Occupancy Status:'
														options={[
															{
																value: "Vacant",
																label: "Vacant",
																color: "teal",
																width: "110px",
															},
															{
																value: "Tenant",
																label: "Tenant",
																color: "orange",
																width: "110px",
															},
															{
																value: "Family Member",
																label: "Family Member",
																color: "teal",
																width: "177px",
															},
															{
																value: "Unauthorized Occupant/Squatter",
																label: "Unauthorized Occupant/Squatter",
																color: "orange",
																width: "330px",
															},
															{
																value: "Unknown",
																label: "Unknown",
																color: "teal",
																width: "130px",
															},
														]}
														width='full'
														gap='gap-4'
														containerClass='w-full flex justify-between'
													/>

													<div className='flex items-center justify-between w-full'>
														<label
															className='block font-bold text-base flex-shrink-0'
															style={{ minWidth: "35%" }}>
															Any Known Access Restrictions, Hostility, or
															Safety Concerns?
														</label>
														<div className='flex gap-4 justify-end items-center flex-1 w-full'>
															<div className='flex gap-4'>
																<RadioButton
																	name='accessRestrictions'
																	value='Yes'
																	selectedValue={property.accessRestrictions}
																	onChange={(e) =>
																		handlePropertyChange(index + 1, e)
																	}
																	label='Yes'
																	color='teal'
																	width='70px'
																/>
																<TextInput
																	ref={(el) =>
																		(accessRestrictionsDetailsRefs.current[
																			index + 1
																		] = el)
																	}
																	name='accessRestrictionsDetails'
																	value={property.accessRestrictionsDetails}
																	onChange={(e) =>
																		handlePropertyChange(index + 1, e)
																	}
																	label='Please Describe:'
																	containerClass='w-full max-w-none'
																	inputClass='placeholder:italic placeholder-[#FD7702]'
																	width='340px'
																/>
															</div>
															<RadioGroup
																name='accessRestrictions'
																value={property.accessRestrictions || ""}
																onChange={(e) =>
																	handlePropertyChange(index + 1, e)
																}
																options={[
																	{
																		value: "No",
																		label: "No ",
																		color: "orange",
																		width: "80px",
																	},
																	{
																		value: "Not Sure",
																		label: "Not Sure",
																		color: "teal",
																		width: "130px",
																	},
																]}
																width='auto'
															/>
														</div>
													</div>
													<div className='flex items-start justify-between w-full gap-2'>
														<label
															className='block font-bold text-base flex-shrink-0'
															style={{ minWidth: "35%" }}>
															Any Urgency, Deadlines, or Court Pressure to List
															or Sell?
														</label>
														<div className='flex gap-4 justify-end items-center flex-1 w-full'>
															<div className='flex gap-4'>
																<RadioButton
																	name='urgency'
																	value='Yes'
																	selectedValue={property.urgency}
																	onChange={(e) =>
																		handlePropertyChange(index + 1, e)
																	}
																	label='Yes'
																	color='teal'
																	width='70px'
																/>
																<TextInput
																	ref={(el) =>
																		(urgencyDetailsRefs.current[index + 1] = el)
																	}
																	name='urgencyDetails'
																	value={property.urgencyDetails}
																	onChange={(e) =>
																		handlePropertyChange(index + 1, e)
																	}
																	label='Details:'
																	containerClass='w-full max-w-none'
																	inputClass='placeholder:italic placeholder-[#FD7702]'
																	width='267px'
																/>
															</div>
															<RadioGroup
																name='urgency'
																value={property.urgency || ""}
																onChange={(e) =>
																	handlePropertyChange(index + 1, e)
																}
																options={[
																	{
																		value: "No",
																		label: "No ",
																		color: "orange",
																		width: "80px",
																	},
																	{
																		value: "Not Sure",
																		label: "Not Sure",
																		color: "teal",
																		width: "130px",
																	},
																]}
																width='auto'
															/>
														</div>
													</div>
													<RadioGroup
														name='multipleProperties'
														value={property.multipleProperties}
														onChange={(e) => handlePropertyChange(index + 1, e)}
														label='Multiple Properties?'
														options={[
															{
																value: "Yes",
																label: "Yes – Details Below",
																color: "teal",
																width: "200px",
															},
															{
																value: "No",
																label: "No ",
																color: "orange",
																width: "130px",
															},
														]}
														width='full'
														gap='gap-4'
														containerClass='w-full flex justify-between'
													/>
												</FormSection>
											))}
									</div>
								)}

								{/* Requested Support */}
								<FormSection
									title='Requested Support (Select All that Apply)'
									icon='fa-hands-helping'>
									<div className='flex flex-col gap-2 w-full'>
										<Checkbox
											name='contactClient'
											group='requestedSupport'
											label='Contact Client Directly and Coordinate Next Steps'
											checked={formData.requestedSupport.contactClient}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='waitForIntro'
											group='requestedSupport'
											label='Wait for Your Intro Email or Call'
											checked={formData.requestedSupport.waitForIntro}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='provideOpinion'
											group='requestedSupport'
											label='Provide a Court-Aligned Opinion of Value'
											checked={formData.requestedSupport.provideOpinion}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='conductWalkthrough'
											group='requestedSupport'
											label='Conduct Property Walkthrough and Condition Report'
											checked={formData.requestedSupport.conductWalkthrough}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='preparePhotos'
											group='requestedSupport'
											label='Prepare Photos for Referee'
											checked={formData.requestedSupport.preparePhotos}
											onChange={handleChange}
											width='full'
										/>
										<div className='flex gap-1 items-start justify-between w-full'>
											<Checkbox
												name='refereeAssigned'
												group='requestedSupport'
												label='No Referee Assigned? Will You Be Ordering a Private Appraisal?'
												checked={formData.requestedSupport.refereeAssigned}
												onChange={handleChange}
												width='450px'
											/>

											<div className='flex gap-1 flex-1 justify-end'>
												<RadioGroup
													name='willOrderPrivateAppraisal'
													value={
														formData.requestedSupport.willOrderPrivateAppraisal
													}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															requestedSupport: {
																...prev.requestedSupport,
																willOrderPrivateAppraisal: e.target.value,
															},
														}))
													}
													options={[
														{
															value: "Yes",
															label: "Yes",
															color: "teal",
															width: "80px",
														},
														{
															value: "No",
															label: "No ",
															color: "orange",
															width: "80px",
														},
														{
															value: "Not Sure",
															label: "Not Sure",
															color: "teal",
															width: "130px",
														},
													]}
													width='auto'
													containerClass='flex gap-1'
												/>
											</div>
										</div>
										<Checkbox
											name='coordinateVendors'
											group='requestedSupport'
											label='Coordinate Vendors (Clean-Out, Locksmith, Etc.)'
											checked={formData.requestedSupport.coordinateVendors}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='notReadyForListing'
											group='requestedSupport'
											label='Pre-Listing Consultation Only - Meet with the Client to Explain the Process and Prep the File'
											checked={formData.requestedSupport.notReadyForListing}
											onChange={handleChange}
											width='full'
										/>
									</div>
								</FormSection>

								{/* Document Upload */}
								<FormSection title='Document Upload' icon='fa-file-upload'>
									<div className='mb-3'>
										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic mb-3 uppercase'>
											Please Upload or Email Any of the Following That Apply :
										</div>
										<div className='flex flex-col gap-2'>
											<Checkbox
												name='lettersOfAdministration'
												group='documentUpload'
												label='Letters of Administration / Testamentary (DE-150)'
												checked={
													formData.documentUpload.lettersOfAdministration
												}
												onChange={handleChange}
												width='full'
											/>
											<Checkbox
												name='lettersOfConservatorship'
												group='documentUpload'
												label='Letters of Conservatorship of The Estate (GC-350)'
												checked={
													formData.documentUpload.lettersOfConservatorship
												}
												onChange={handleChange}
												width='full'
											/>
											<Checkbox
												name='trustCertification'
												group='documentUpload'
												label='Trust Certification Page (or Full Trust Agreement if Unavailable)'
												checked={formData.documentUpload.trustCertification}
												onChange={handleChange}
												width='full'
											/>
											<Checkbox
												name='recordedDeed'
												group='documentUpload'
												label='Recorded Deed in Trust Name (to Confirm Title Vesting Prior to Prelim — Optional, But Helps Speed Up Coordination)'
												checked={formData.documentUpload.recordedDeed}
												onChange={handleChange}
												width='full'
											/>

											<Checkbox
												name='courtMinuteOrder'
												group='documentUpload'
												label='Minute Order or Court Filling Confirming Sale Authority'
												checked={formData.documentUpload.courtMinuteOrder}
												onChange={handleChange}
												width='full'
											/>
											<Checkbox
												name='relevantFilings'
												group='documentUpload'
												label='Any Relevant Filings, Petitions, or Timeline Documents'
												checked={formData.documentUpload.relevantFilings}
												onChange={handleChange}
												width='full'
											/>
										</div>
									</div>
									<div
										style={{
											lineHeight: "1.5",
										}}
										className='bg-[#FD7702] font-bold text-white px-2 py-1 rounded w-max italic mb-3 uppercase'>
										Please ensure all uploaded documents match the case type
										selected above.
									</div>
									<div className='mt-4 w-full'>
										<FileUpload
											name='documentFiles'
											onChange={handleFileChange}
											label='Upload Documents'
											accept='.pdf,.doc,.docx,.jpg,.png,.zip'
											width='full'
											multiple
										/>
										<div className='mt-2 text-sm text-gray-500'>
											{formData.uploadedFiles.length > 0 && (
												<div>
													<p className='font-bold'>Uploaded files:</p>
													<ul className='list-disc pl-5'>
														{formData.uploadedFiles.map((file, index) => (
															<li key={index}>{file.name}</li>
														))}
													</ul>
												</div>
											)}
										</div>
									</div>
								</FormSection>

								{/* How Did You Hear About Us */}
								<FormSection
									title='How Did You Hear About 833PROBAID™?'
									icon='fa-question'>
									<div className='grid grid-cols-2 gap-2 mb-2'>
										<Checkbox
											name='onlineSearch'
											value='Online Search'
											checked={formData.onlineSearch}
											onChange={handleChange}
											label='Online Search'
											width='full'
										/>
										<Checkbox
											name='socialMedia'
											value='Social Media'
											checked={formData.socialMedia}
											onChange={handleChange}
											label='Social Media'
											width='full'
										/>
										<Checkbox
											name='directAttorneyReferral'
											value='Direct Attorney Referral'
											checked={formData.directAttorneyReferral}
											onChange={handleChange}
											label='Direct Attorney Referral'
											width='full'
										/>
										<Checkbox
											name='pastCasePriorMatter'
											value='Past Case / Prior Matter'
											checked={formData.pastCasePriorMatter}
											onChange={handleChange}
											label='Past Case / Prior Matter'
											width='full'
										/>
										<Checkbox
											name='emailNewsletterOrBrochure'
											value='Email Newsletter or Brochure'
											checked={formData.emailNewsletterOrBrochure}
											onChange={handleChange}
											label='Email Newsletter or Brochure'
											width='full'
										/>
										<Checkbox
											name='barAssociationOrLegalEvent'
											value='Bar Association / Legal Event'
											checked={formData.barAssociationOrLegalEvent}
											onChange={handleChange}
											label='Bar Association / Legal Event'
											width='full'
										/>
										<Checkbox
											name='courtClerkOrProbateExaminer'
											value='Court Clerk or Probate Examiner'
											checked={formData.courtClerkOrProbateExaminer}
											onChange={handleChange}
											label='Court Clerk or Probate Examiner'
											width='full'
										/>
										<div className='w-full flex items-center gap-2'>
											<Checkbox
												name='other'
												value='Other'
												checked={formData.other}
												onChange={handleChange}
												label='Other'
												color='orange'
												width='90px'
											/>
											<TextInput
												name='otherDetails'
												value={formData.otherDetails}
												onChange={handleChange}
												width='100%'
												ref={howDidYouHearOtherRef}
											/>
										</div>
									</div>
								</FormSection>

								<div className='pt-5 pb-9'></div>

								{/* Footer Contact Information */}
								<div className='bg-[#0097A7] text-white py-1 pl-8 pr-1 z-10 absolute bottom-0 left-2 right-0'>
									<div className='flex gap-3 justify-evenly text-2xl font-bold'>
										{/* Phone Section */}
										<a
											href='tel:8337762243'
											className='flex items-center hover:text-[#FD7702] group text-center -ml-11'>
											<i className='fas fa-phone-volume text-4xl text-[#FD7702] group-hover:text-white mr-3'></i>
											<div className='flex flex-col items-end leading-tight'>
												<div className='tracking-wide'>(833) PROBAID</div>
												<div className='tracking-wider lowercase -mt-1 w-max'>
													7762243
												</div>
											</div>
										</a>
										<div className='border-r-2 border-white'></div>

										{/* Email Section */}
										<a
											href='mailto:Info@833probaid.com'
											className='flex items-center border-white group'>
											<i className='fas fa-envelope text-[#FD7702] group-hover:text-white text-4xl mr-3'></i>
											<span>
												<span className='text-black group-hover:text-white'>
													Info@
												</span>
												<span className='text-white group-hover:text-black'>
													833probaid
												</span>
												<span className='text-black group-hover:text-white'>
													.com
												</span>
											</span>
										</a>

										<div className='border-r-2 border-white'></div>
										{/* Website Section */}
										<a
											href='https://www.833probaid.com'
											className='flex items-center group'>
											<i className='fas fa-globe text-[#FD7702] group-hover:text-white text-4xl mr-3'></i>
											<span>
												<span className='text-black group-hover:text-white'>
													www.
												</span>
												<span className='text-white group-hover:text-black'>
													833probaid
												</span>
												<span className='text-black group-hover:text-white'>
													.com
												</span>
											</span>
										</a>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className='max-w-full overflow-x-hidden px-4'>
				<Typography className='text-3xl md:text-5xl font-bold text-colorTeal mt-7'>
					FINAL REFERRAL STATEMENT
				</Typography>
				<p className='font-bold text-xl mt-5 text-colorOrange'>
					Once submitted, I'll protect the estate's interest, contact the client
					if instructed, and coordinate with your office as needed.
					<br />
					<br />
					By submitting this referral, you confirm that you have permission to
					share the contact's information for professional coordination, and
					that your client is aware of this handoff, consents to professional
					contact, and authorizes the coordination of the real estate matter in
					accordance with their fiduciary duty and the court's expectations.
					<br />
					<br />I don't add to email lists, spam, or outsource the file.
					Everything stays in- house and court-aligned—confidential,
					professional, and handled with care.
				</p>
				<div className='flex justify-center mt-6'>
					<button
						className='bg-[#0097A7] text-xl font-bold text-white px-5 py-2  rounded hover:bg-[#1f8a8b] transition-colors disabled:opacity-50'
						onClick={handleSendPdfByEmail}
						disabled={isSendingEmail}>
						{isSendingEmail ? (
							<>
								<i className='fas fa-spinner fa-spin mr-2'></i>Sending...
							</>
						) : (
							<>
								<i className='fas fa-envelope mr-2'></i>Submit
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Form;
