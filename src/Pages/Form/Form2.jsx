import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import Swal from "sweetalert2";
import {
	Checkbox,
	TextInput,
	FileUpload,
	RadioButton,
	RadioGroup,
	FormSection,
	renderLabel,
} from "../../components/SharedComponents";

const DummyYesRadio = ({ value = false }) => {
	return (
		<RadioButton
			name={"dummy"}
			value={"yes"}
			selectedValue={value ? "yes" : "no"}
			label={"Yes"}
			color={"teal"}
			width={"50px"}
		/>
	);
};

function Form2() {
	const [formData, setFormData] = useState({
		businessName: "",
		yourName: "",
		cellPhone: "",
		officePhone: "",
		email: "",
		acceptDeferredPayment: "",
		w9Form: null,
		paidThroughEscrow: "",
		requireSignedAgreement: "",
		insured: "",
		cancellationFee: "",
		cancellationAmount: "",
		takePhotos: "",
		subcontract: "",
		headquarters: "",
		travelDistance: "",
		specificAreas: "",
		paymentMethods: {
			cash: false,
			check: false,
			creditCard: false,
			zelle: false,
			venmo: false,
			paypal: false,
			escrowOnly: false,
		},
		daysAvailable: {
			mon: false,
			tue: false,
			wed: false,
			thu: false,
			fri: false,
			sat: false,
			sun: false,
		},
		howSoon: "",
		preferredTimeWindow: "",
		emergencyServices: "",
		servicesOffered: {
			locksmith: false,
			haulingJunkRemoval: false,
			deepCleaning: false,
			biohazardCleanup: false,
			propertyInspector: false,
			securityBoardUp: false,
			estateLiquidator: false,
			generalContractorHandyman: false,
			roofingStructuralInspection: false,
			translationInterpretationServices: false,
			others: false,
		},
		othersList: "",
		roofingStructuralInspection: "",
		generalContractorHandyman: "",
		notesOrSpecialRequirements: "",
		serviceFeeSheet: null,
		licensed: "",
		licenseNumber: "",
		suretyCompany: "",
		insuredSecond: "",
		coiFile: null,
		bonded: "",
		bondNumber: "",
		bondCertFile: null,
		courtSupervisedUnderstand: "",
		notifyAgentSensitive: "",
		agreeNotToTakeItems: "",
		agreeToIndemnify: "",
		understandNoGuarantee: "",

		// Translation/Interpretation Services
		translationServices: {
			languagesOffered: "",
			areasServed: "",
			inPersonHourlyRate: "",
			phoneVirtualHourlyRate: "",
			listingPresentationTranslation: false,
			contractDisclosureTranslation: false,
			propertyWalkthroughTranslation: false,
			attorneyConferenceTranslation: false,
			otherAvailability: false,
			otherAvailabilityList: "",
			certifiedInterpreter: false,
			certifiedTranslator: false,
			certifyingAuthority: "",
			certifyingOrganization: "",
			licenseNumber: "",
			translatorLicenseNumber: "",
			languagePairs: "",
			yearsOfExperience: "",
			turnaroundTime: "",
			otherSpecializationList: "",
			certificationFile: null,
			specializations: {
				willsTrusts: false,
				probateCourtForms: false,
				propertyDisclosures: false,
				legalContracts: false,
				medicalDocuments: false,
				other: false,
				iContractTranslation: false,
			},
		},
	});
	const [isSendingEmail, setIsSendingEmail] = useState(false);

	// Zoom control state
	const [zoomLevel, setZoomLevel] = useState(1);
	const formContainerRef = useRef(null);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		const group = e.target.dataset.group;

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
			// Handle nested translation services fields
			if (name.startsWith("translationServices.")) {
				const fieldName = name.replace("translationServices.", "");
				setFormData((prev) => ({
					...prev,
					translationServices: {
						...prev.translationServices,
						[fieldName]: value,
					},
				}));
			} else {
				setFormData((prev) => ({
					...prev,
					[name]: value,
				}));
			}
		}
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		// Handle nested translation services file fields
		if (name.startsWith("translationServices.")) {
			const fieldName = name.replace("translationServices.", "");
			setFormData((prev) => ({
				...prev,
				translationServices: {
					...prev.translationServices,
					[fieldName]: files && files[0] ? files[0] : null,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: files && files[0] ? files[0] : null,
			}));
		}
	};

	const printRef = useRef();

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

	const handleSendPdfByEmail = async () => {
		if (isSendingEmail) return;
		if (!formData.email) {
			Swal.fire({
				icon: "error",
				title: "Email Required",
				text: "Please enter your email address in the form before submitting.",
			});
			return;
		}

		setIsSendingEmail(true);
		const divId = "printable-content";
		const fileName = "VendorIntakeForm";
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

			if (formData.w9Form) {
				try {
					const w9Base64 = await fileToBase64(formData.w9Form);
					attachments.push({
						name: formData.w9Form.name,
						content: w9Base64,
					});
				} catch (error) {
					console.error("Error converting W9 form to base64:", error);
				}
			}
			if (formData.serviceFeeSheet) {
				try {
					const serviceFeeSheetBase64 = await fileToBase64(
						formData.serviceFeeSheet,
					);
					attachments.push({
						name: formData.serviceFeeSheet.name,
						content: serviceFeeSheetBase64,
					});
				} catch (error) {
					console.error("Error converting service fee sheet to base64:", error);
				}
			}
			if (formData.coiFile) {
				try {
					const coiFileBase64 = await fileToBase64(formData.coiFile);
					attachments.push({
						name: formData.coiFile.name,
						content: coiFileBase64,
					});
				} catch (error) {
					console.error("Error converting COI file to base64:", error);
				}
			}
			if (formData.bondCertFile) {
				try {
					const bondCertFileBase64 = await fileToBase64(formData.bondCertFile);
					attachments.push({
						name: formData.bondCertFile.name,
						content: bondCertFileBase64,
					});
				} catch (error) {
					console.error("Error converting bond certificate to base64:", error);
				}
			}
			if (formData.translationServices.certificationFile) {
				try {
					const certFileBase64 = await fileToBase64(
						formData.translationServices.certificationFile,
					);
					attachments.push({
						name: formData.translationServices.certificationFile.name,
						content: certFileBase64,
					});
				} catch (error) {
					console.error(
						"Error converting certification file to base64:",
						error,
					);
				}
			}

			const emailHtmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #00796b;">Vendor Intake Form Submission</h2>
          <p>Hi <strong>${formData.yourName || "Vendor"}</strong>,</p>
          <p>Thank you for submitting your Vendor Intake Form. Please find the PDF copy of your submission attached to this email.</p>
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
						email: formData.email,
						name: formData.yourName || "Vendor",
					},
				],
				subject: "Your Vendor Intake Form Submission",
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
				title: "Form Submitted & Emailed",
				text: "Your form has been submitted and a PDF copy has been emailed to you.",
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("=== FORM SUBMISSION ===");
		console.log("Complete Form Data:", formData);

		console.log("======================");
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
										Vendor Intake Form
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit} className='relative mt-4 px-1 mx-5'>
								<div className='absolute left-2 top-10 bottom-10 w-[6px] bg-[#FD7702]'></div>

								{/* Company Information */}
								<FormSection title='Company Information' icon='fa-user'>
									<TextInput
										name='businessName'
										value={formData.businessName}
										onChange={handleChange}
										label='Your Business Name:'
										width='full'
									/>
									<div className='flex gap-4 w-full'>
										<TextInput
											name='yourName'
											value={formData.yourName}
											onChange={handleChange}
											label='Your Name/Title:'
											inputClass='w-[400px]'
											containerClass='justify-between'
										/>
										<TextInput
											name='email'
											value={formData.email}
											onChange={handleChange}
											label='Your E-Mail:'
											inputClass='w-[440px]'
											containerClass='justify-between'
										/>
									</div>

									<div className='flex gap-4 w-full'>
										<TextInput
											name='officePhone'
											value={formData.officePhone}
											onChange={handleChange}
											label='Your Business Phone:'
											inputClass='w-[400px]'
											containerClass='justify-between'
										/>
										<TextInput
											name='cellPhone'
											value={formData.cellPhone}
											onChange={handleChange}
											label='Your Cell Phone:'
											inputClass='w-[440px]'
											containerClass='justify-between'
										/>
									</div>
								</FormSection>

								{/* Payment Terms & Work Agreement */}
								<FormSection
									title='Payment Terms & Work Agreement'
									icon='fa-dollar-sign'>
									<RadioGroup
										name='acceptDeferredPayment'
										value={formData.acceptDeferredPayment}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "80px",
											},
										]}
										label='Do You Accept Deferred Payment from Escrow?'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<div className='flex items-center gap-4'>
										<label className='text-base italic flex items-center gap-2'>
											<span className='text-[#FD7702] font-bold pr-1'>
												~ If
											</span>
											<DummyYesRadio
												value={
													formData.acceptDeferredPayment === "yes"
														? true
														: false
												}
											/>
											,{" "}
											<span className='text-[#FD7702] font-bold ml-4'>
												Is Job Over $600? If So, Upload W-9 Form
											</span>
										</label>
										<FileUpload
											name='w9Form'
											onChange={handleFileChange}
											label='Upload W-9 Form (PDF)'
											accept='.pdf'
											width='250px'
										/>
									</div>

									<RadioGroup
										name='paidThroughEscrow'
										value={formData.paidThroughEscrow}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "80px",
											},
										]}
										label='If Paid Through Escrow, Do You Agree to Wait Until Closing with No Late Fees or Interest?'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<RadioGroup
										name='requireSignedAgreement'
										value={formData.requireSignedAgreement}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "80px",
											},
										]}
										label='Do You Require a Signed Service Agreement?'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<RadioGroup
										name='insured'
										value={formData.insured}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "80px",
											},
										]}
										label='Are You Insured and Able to Provide a Certificate if Needed? (Especially for Biohazard)'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<RadioGroup
										name='cancellationFee'
										value={formData.cancellationFee}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "80px",
											},
										]}
										label='Do You Charge Cancellation or Rescheduling Fees?'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<div className='flex items-center gap-4'>
										<label className='text-base italic flex items-center gap-2 min-w-max'>
											<span className='text-[#FD7702] font-bold pr-1'>
												~ If
											</span>
											<DummyYesRadio
												value={
													formData.cancellationFee === "yes" ? true : false
												}
											/>
											,
											<span className='text-[#FD7702] font-bold mx-4'>
												How Much?
											</span>
										</label>
										<div className='flex items-center gap-2'>
											<span className='font-bold text-xl text-[#FD7702] -mr-9 z-10'>
												$
											</span>
											<TextInput
												name='cancellationAmount'
												value={formData.cancellationAmount}
												onChange={handleChange}
												width='200px'
												inputClass='pl-9'
											/>
											<span className='font-bold text-[#FD7702] pl-2'>
												{renderLabel("(Write $0 If None)", "teal")}
											</span>
										</div>
									</div>

									<RadioGroup
										name='takePhotos'
										value={formData.takePhotos}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "80px",
											},
										]}
										label='Do You Take Before & After Photos - and Can You Email/Text Them to Me?'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<RadioGroup
										name='subcontract'
										value={formData.subcontract}
										onChange={handleChange}
										options={[
											{
												value: "subcontracted",
												label: "Subcontracted",
												color: "teal",
												width: "170px",
											},
											{
												value: "myself",
												label: "Perform Myself",
												color: "orange",
												width: "175px",
											},
										]}
										label='Do You Subcontract the Work or Perform It Yourself?'
										width='full'
										containerClass='flex justify-between items-center'
									/>
								</FormSection>

								{/* Service Area */}
								<FormSection title='Service Area' icon='fa-map-marker-alt'>
									<TextInput
										name='headquarters'
										value={formData.headquarters}
										onChange={handleChange}
										label='Headquartered in (City):'
										width='full'
									/>

									<RadioGroup
										name='travelDistance'
										value={formData.travelDistance}
										onChange={handleChange}
										options={[
											{
												value: "10",
												label: "10",
												color: "teal",
												width: "80px",
											},
											{
												value: "20",
												label: "20",
												color: "orange",
												width: "80px",
											},
											{
												value: "30+",
												label: "30+",
												color: "teal",
												width: "80px",
											},
										]}
										label='How Many Miles Are You Willing to Travel from Base Location?'
										width='full'
										containerClass='flex justify-between items-center'
									/>

									<TextInput
										name='specificAreas'
										value={formData.specificAreas}
										onChange={handleChange}
										label='Do You Serve Specific Counties or Cities Only?'
										width='full'
									/>
								</FormSection>

								{/* Payment Methods */}
								<FormSection
									title='Payment Methods Accepted'
									icon='fa-credit-card'>
									<div className='flex flex-col gap-3'>
										<Checkbox
											name='cash'
											group='paymentMethods'
											label='Cash (Must Provide Invoice & Receipt with Company Name)'
											checked={formData.paymentMethods.cash}
											onChange={handleChange}
											width='full'
										/>
										<div className='flex gap-4'>
											<Checkbox
												name='check'
												group='paymentMethods'
												label='Check'
												checked={formData.paymentMethods.check}
												onChange={handleChange}
												width='105px'
											/>
											<Checkbox
												name='creditCard'
												group='paymentMethods'
												label='Credit Card'
												checked={formData.paymentMethods.creditCard}
												onChange={handleChange}
												width='150px'
											/>
											<Checkbox
												name='zelle'
												group='paymentMethods'
												label='Zelle'
												checked={formData.paymentMethods.zelle}
												onChange={handleChange}
												width='110px'
											/>
											<Checkbox
												name='venmo'
												group='paymentMethods'
												label='Venmo'
												checked={formData.paymentMethods.venmo}
												onChange={handleChange}
												width='120px'
											/>
											<Checkbox
												name='paypal'
												group='paymentMethods'
												label='PayPal'
												checked={formData.paymentMethods.paypal}
												onChange={handleChange}
												width='120px'
											/>
											<Checkbox
												name='escrowOnly'
												group='paymentMethods'
												label='Escrow pay only'
												checked={formData.paymentMethods.escrowOnly}
												onChange={handleChange}
												width='140px'
											/>
										</div>
									</div>
								</FormSection>

								{/* Availability & Scheduling */}
								<FormSection
									title='Availability & Scheduling'
									icon='fa-calendar-check'>
									<div className='flex items-center justify-start'>
										<label className='block font-bold text-base w-[290px]'>
											{renderLabel("Days Available:")}
										</label>
										<div className='flex items-center flex-wrap gap-x-5'>
											<Checkbox
												name='mon'
												group='daysAvailable'
												label='Mon'
												checked={formData.daysAvailable.mon}
												onChange={handleChange}
												width='105px'
											/>
											<Checkbox
												name='tue'
												group='daysAvailable'
												label='Tue'
												checked={formData.daysAvailable.tue}
												onChange={handleChange}
												width='115px'
											/>
											<Checkbox
												name='wed'
												group='daysAvailable'
												label='Wed'
												checked={formData.daysAvailable.wed}
												onChange={handleChange}
												width='117px'
											/>
											<Checkbox
												name='thu'
												group='daysAvailable'
												label='Thu'
												checked={formData.daysAvailable.thu}
												onChange={handleChange}
												width='110px'
											/>
											<Checkbox
												name='fri'
												group='daysAvailable'
												label='Fri'
												checked={formData.daysAvailable.fri}
												onChange={handleChange}
												width='110px'
											/>
											<Checkbox
												name='sat'
												group='daysAvailable'
												label='Sat'
												checked={formData.daysAvailable.sat}
												onChange={handleChange}
												width='110px'
											/>
											<Checkbox
												name='sun'
												group='daysAvailable'
												label='Sun'
												checked={formData.daysAvailable.sun}
												onChange={handleChange}
												width='95px'
											/>
										</div>
									</div>

									<RadioGroup
										name='howSoon'
										value={formData.howSoon}
										onChange={handleChange}
										options={[
											{
												value: "Same Day",
												label: "Same Day",
												color: "teal",
												width: "150px",
											},
											{
												value: "2-Day Notice",
												label: "2-Day Notice",
												color: "orange",
												width: "170px",
											},
											{
												value: "2-3 Day Notice",
												label: "2-3 Day Notice",
												color: "teal",
												width: "170px",
											},
										]}
										label='How Soon Can You Typically Do a Job?'
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>

									<RadioGroup
										name='preferredTimeWindow'
										value={formData.preferredTimeWindow}
										onChange={handleChange}
										options={[
											{
												value: "Morning",
												label: "Morning",
												color: "teal",
												width: "150px",
											},
											{
												value: "Afternoon",
												label: "Afternoon",
												color: "orange",
												width: "170px",
											},
											{
												value: "Flexible",
												label: "Flexible",
												color: "teal",
												width: "170px",
											},
										]}
										label='Preferred time window for arrival?'
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>

									<RadioGroup
										name='emergencyServices'
										value={formData.emergencyServices}
										onChange={handleChange}
										options={[
											{
												value: "Yes",
												label: "Yes",
												color: "teal",
												width: "170px",
											},
											{
												value: "No",
												label: "No",
												color: "orange",
												width: "170px",
											},
										]}
										label='Emergency Services Available?'
										width='full'
										gap='gap-4'
										containerClass='w-full flex justify-between'
									/>
								</FormSection>

								{/* Services Offered */}
								<FormSection
									title='Services Offered (Check All That Apply)'
									icon='fa-concierge-bell'>
									<div className='grid grid-cols-3 gap-y-2 mb-4'>
										<Checkbox
											name='locksmith'
											group='servicesOffered'
											label='Locksmith'
											checked={formData.servicesOffered.locksmith}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='haulingJunkRemoval'
											group='servicesOffered'
											label='Junk Removal/Hauling'
											checked={formData.servicesOffered.haulingJunkRemoval}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='deepCleaning'
											group='servicesOffered'
											label='Deep Property Cleaning'
											checked={formData.servicesOffered.deepCleaning}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='biohazardCleanup'
											group='servicesOffered'
											label='Biohazard/Hazardous Waste Cleanup'
											checked={formData.servicesOffered.biohazardCleanup}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='propertyInspector'
											group='servicesOffered'
											label='Licensed Property Inspector'
											checked={formData.servicesOffered.propertyInspector}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='securityBoardUp'
											group='servicesOffered'
											label='Security Services/Board-Up'
											checked={formData.servicesOffered.securityBoardUp}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='estateLiquidator'
											group='servicesOffered'
											label='Estate Liquidator/Auction Services'
											checked={formData.servicesOffered.estateLiquidator}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='generalContractorHandyman'
											group='servicesOffered'
											label='General Contractor/Handyman'
											checked={
												formData.servicesOffered.generalContractorHandyman
											}
											onChange={handleChange}
											width='full'
										/>
										<Checkbox
											name='roofingStructuralInspection'
											group='servicesOffered'
											label='Licensed Roofer/Inspection & Repair'
											checked={
												formData.servicesOffered.roofingStructuralInspection
											}
											onChange={handleChange}
											width='full'
										/>
									</div>
									<div className='grid grid-cols-3 gap-y-2'>
										<Checkbox
											name='translationInterpretationServices'
											group='servicesOffered'
											label='Translation/Interpretation Services'
											checked={
												formData.servicesOffered
													.translationInterpretationServices
											}
											onChange={handleChange}
											width='full'
										/>
										<div className='flex items-center col-span-2 gap-2'>
											<Checkbox
												name='others'
												group='servicesOffered'
												label='Other (List):'
												checked={formData.servicesOffered.others}
												onChange={handleChange}
												width='150px'
											/>
											<TextInput
												name='othersList'
												value={formData.othersList}
												onChange={handleChange}
												width='full'
											/>
										</div>
									</div>
								</FormSection>

								{/* Translation/Interpretation Services */}
								{formData.servicesOffered.translationInterpretationServices && (
									<FormSection
										title='Translation / Interpretation Services'
										icon='fa-language'>
										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
											(If Checked, Complete The Fields Below)
										</div>

										<TextInput
											name='translationServices.languagesOffered'
											value={formData.translationServices.languagesOffered}
											onChange={handleChange}
											label='Languages Offered (List All Fluent):'
											width='full'
										/>

										<TextInput
											name='translationServices.areasServed'
											value={formData.translationServices.areasServed}
											onChange={handleChange}
											label='Areas Served (Counties / Regions):'
											width='full'
										/>

										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
											Rates (Specify) :
										</div>
										<div className='grid grid-cols-2 gap-4'>
											<div className='flex items-center gap-4'>
												<label className='font-bold text-base min-w-max mr-2 flex items-center gap-2'>
													{renderLabel("In-Person Hourly Rate:")}
												</label>
												<span className='font-bold text-xl text-[#FD7702] -mr-10 z-10'>
													$
												</span>
												<TextInput
													name='translationServices.inPersonHourlyRate'
													value={
														formData.translationServices.inPersonHourlyRate
													}
													onChange={handleChange}
													inputClass='pl-7'
													width='100%'
												/>
											</div>
											<div className='flex items-center gap-4'>
												<label className='font-bold text-base min-w-max mr-2 flex items-center gap-2'>
													{renderLabel(
														"Phone / Virtual Hourly Rate (or Flat Call Rate):",
													)}
												</label>
												<span className='font-bold text-xl text-[#FD7702] -mr-10 z-10'>
													$
												</span>
												<TextInput
													name='translationServices.phoneVirtualHourlyRate'
													value={
														formData.translationServices.phoneVirtualHourlyRate
													}
													onChange={handleChange}
													inputClass='pl-7'
													width='200px'
												/>
											</div>
										</div>

										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
											Availability (Check All That Apply) :
										</div>
										<div className='space-y-2 mb-3'>
											<Checkbox
												name='listingPresentationTranslation'
												group='translationServices'
												label='Listing Presentation Translation (Executors/Heirs)'
												checked={
													formData.translationServices
														.listingPresentationTranslation
												}
												onChange={(e) => {
													setFormData((prev) => ({
														...prev,
														translationServices: {
															...prev.translationServices,
															listingPresentationTranslation: e.target.checked,
														},
													}));
												}}
												width='full'
											/>
											<Checkbox
												name='contractDisclosureTranslation'
												group='translationServices'
												label='Contract/Disclosure Walkthrough Translation (Probate Forms & Addenda)'
												checked={
													formData.translationServices
														.contractDisclosureTranslation
												}
												onChange={(e) => {
													setFormData((prev) => ({
														...prev,
														translationServices: {
															...prev.translationServices,
															contractDisclosureTranslation: e.target.checked,
														},
													}));
												}}
												width='full'
											/>
											<Checkbox
												name='propertyWalkthroughTranslation'
												group='translationServices'
												label='Property Walkthrough / Vendor Day Translation'
												checked={
													formData.translationServices
														.propertyWalkthroughTranslation
												}
												onChange={(e) => {
													setFormData((prev) => ({
														...prev,
														translationServices: {
															...prev.translationServices,
															propertyWalkthroughTranslation: e.target.checked,
														},
													}));
												}}
												width='full'
											/>
											<Checkbox
												name='attorneyConferenceTranslation'
												group='translationServices'
												label='Attorney Conference Translation (By Request Only)'
												checked={
													formData.translationServices
														.attorneyConferenceTranslation
												}
												onChange={(e) => {
													setFormData((prev) => ({
														...prev,
														translationServices: {
															...prev.translationServices,
															attorneyConferenceTranslation: e.target.checked,
														},
													}));
												}}
												width='full'
											/>
											<div className='flex items-center gap-2'>
												<Checkbox
													name='otherAvailability'
													group='translationServices'
													label='Other (List):'
													checked={
														formData.translationServices.otherAvailability
													}
													onChange={(e) => {
														setFormData((prev) => ({
															...prev,
															translationServices: {
																...prev.translationServices,
																otherAvailability: e.target.checked,
															},
														}));
													}}
													width='150px'
												/>
												<TextInput
													name='translationServices.otherAvailabilityList'
													value={
														formData.translationServices.otherAvailabilityList
													}
													onChange={handleChange}
													width='full'
												/>
											</div>
										</div>

										<div
											style={{
												lineHeight: "1.5",
											}}
											className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
											Certification (If Applicable) :
										</div>
										<div className='space-y-3'>
											<Checkbox
												name='certifiedInterpreter'
												group='translationServices'
												label='I am a Certified Court Interpreter'
												checked={
													formData.translationServices.certifiedInterpreter
												}
												onChange={(e) => {
													setFormData((prev) => ({
														...prev,
														translationServices: {
															...prev.translationServices,
															certifiedInterpreter: e.target.checked,
														},
													}));
												}}
												width='full'
											/>
											{formData.translationServices.certifiedInterpreter && (
												<div className='space-y-3 pl-8'>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Certifying Authority (e.g., California Judicial Council, ATA, NAJIT):",
															)}
														</label>
														<TextInput
															name='translationServices.certifyingAuthority'
															value={
																formData.translationServices.certifyingAuthority
															}
															onChange={handleChange}
															width='300px'
														/>
													</div>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Certification ID / Membership Number (If Available):",
															)}
														</label>
														<TextInput
															name='translationServices.licenseNumber'
															value={formData.translationServices.licenseNumber}
															onChange={handleChange}
															width='300px'
														/>
													</div>
												</div>
											)}

											<Checkbox
												name='certifiedTranslator'
												group='translationServices'
												label='I am a Certified Court Translator'
												checked={
													formData.translationServices.certifiedTranslator
												}
												onChange={(e) => {
													setFormData((prev) => ({
														...prev,
														translationServices: {
															...prev.translationServices,
															certifiedTranslator: e.target.checked,
														},
													}));
												}}
												width='full'
											/>
											{formData.translationServices.certifiedTranslator && (
												<div className='space-y-3 pl-8'>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Certifying Organization (e.g: ATA, NAJIT, Univ. Program):",
															)}
														</label>
														<TextInput
															name='translationServices.certifyingOrganization'
															value={
																formData.translationServices
																	.certifyingOrganization
															}
															onChange={handleChange}
															width='100%'
														/>
													</div>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Certification ID / Membership Number (If Available):",
															)}
														</label>
														<TextInput
															name='translationServices.translatorLicenseNumber'
															value={
																formData.translationServices
																	.translatorLicenseNumber
															}
															onChange={handleChange}
															width='100%'
														/>
													</div>
													<div
														style={{
															lineHeight: "1.5",
														}}
														className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
														Languages/Language Pairs :
													</div>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Example: Spanish to English(Legal), Armenian to English(Medical)",
															)}
														</label>
														<TextInput
															name='translationServices.languagePairs'
															value={formData.translationServices.languagePairs}
															onChange={handleChange}
															width='100%'
														/>
													</div>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Years of Legal Document Translation Experience:",
															)}
														</label>
														<TextInput
															name='translationServices.yearsOfExperience'
															value={
																formData.translationServices.yearsOfExperience
															}
															onChange={handleChange}
															width='100px'
														/>
														<span className='font-bold text-base'>
															{renderLabel("years")}
														</span>
													</div>
													<div
														style={{
															lineHeight: "1.5",
														}}
														className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
														Specialization (Check All That Apply) :
													</div>
													<div className='space-y-2 mb-3'>
														<Checkbox
															name='willsTrusts'
															group='translationServices.specializations'
															label='Wills / Trusts'
															checked={
																formData.translationServices.specializations
																	?.willsTrusts
															}
															onChange={(e) => {
																setFormData((prev) => ({
																	...prev,
																	translationServices: {
																		...prev.translationServices,
																		specializations: {
																			...prev.translationServices
																				?.specializations,
																			willsTrusts: e.target.checked,
																		},
																	},
																}));
															}}
															width='full'
														/>
														<Checkbox
															name='probateCourtForms'
															group='translationServices.specializations'
															label='Probate Court Forms'
															checked={
																formData.translationServices.specializations
																	?.probateCourtForms
															}
															onChange={(e) => {
																setFormData((prev) => ({
																	...prev,
																	translationServices: {
																		...prev.translationServices,
																		specializations: {
																			...prev.translationServices
																				?.specializations,
																			probateCourtForms: e.target.checked,
																		},
																	},
																}));
															}}
															width='full'
														/>
														<Checkbox
															name='propertyDisclosures'
															group='translationServices.specializations'
															label='Property Disclosures'
															checked={
																formData.translationServices.specializations
																	?.propertyDisclosures
															}
															onChange={(e) => {
																setFormData((prev) => ({
																	...prev,
																	translationServices: {
																		...prev.translationServices,
																		specializations: {
																			...prev.translationServices
																				?.specializations,
																			propertyDisclosures: e.target.checked,
																		},
																	},
																}));
															}}
															width='full'
														/>
														<Checkbox
															name='legalContracts'
															group='translationServices.specializations'
															label='Legal Contracts'
															checked={
																formData.translationServices.specializations
																	?.legalContracts
															}
															onChange={(e) => {
																setFormData((prev) => ({
																	...prev,
																	translationServices: {
																		...prev.translationServices,
																		specializations: {
																			...prev.translationServices
																				?.specializations,
																			legalContracts: e.target.checked,
																		},
																	},
																}));
															}}
															width='full'
														/>
														<Checkbox
															name='medicalDocuments'
															group='translationServices.specializations'
															label='Medical Documents'
															checked={
																formData.translationServices.specializations
																	?.medicalDocuments
															}
															onChange={(e) => {
																setFormData((prev) => ({
																	...prev,
																	translationServices: {
																		...prev.translationServices,
																		specializations: {
																			...prev.translationServices
																				?.specializations,
																			medicalDocuments: e.target.checked,
																		},
																	},
																}));
															}}
															width='full'
														/>
														<div className='flex items-center gap-2'>
															<Checkbox
																name='other'
																group='translationServices.specializations'
																label='Other:'
																checked={
																	formData.translationServices.specializations
																		?.other
																}
																onChange={(e) => {
																	setFormData((prev) => ({
																		...prev,
																		translationServices: {
																			...prev.translationServices,
																			specializations: {
																				...prev.translationServices
																					?.specializations,
																				other: e.target.checked,
																			},
																		},
																	}));
																}}
																width='100px'
															/>
															<TextInput
																name='translationServices.otherSpecializationList'
																value={
																	formData.translationServices
																		.otherSpecializationList
																}
																onChange={handleChange}
																width='full'
															/>
														</div>
													</div>
													<div
														style={{
															lineHeight: "1.5",
														}}
														className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
														Turnaround Time :
													</div>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Average Turnaround Time For Legal Doc Translation (1-5 Pages):",
															)}
														</label>
														<TextInput
															name='translationServices.turnaroundTime'
															value={
																formData.translationServices.turnaroundTime
															}
															onChange={handleChange}
															width='100px'
														/>
														<span className='font-bold text-base'>
															{renderLabel("days")}
														</span>
													</div>
													<div className='flex items-center gap-4'>
														<label className='font-bold text-base min-w-max flex items-center gap-2'>
															{renderLabel(
																"Upload Professional Translation Certification or Proof of Qualifications:",
															)}
														</label>
														<FileUpload
															name='translationServices.certificationFile'
															onChange={handleFileChange}
															label='[File Upload]'
															accept='.pdf,.jpg,.png'
															width='250px'
														/>
													</div>
													<Checkbox
														name='iContractTranslation'
														group='translationServices.specializations'
														label='I Confirm That I Am Professionally Certified And Qualified To Translate Legal Documents Within The United States.'
														checked={
															formData.translationServices.specializations
																?.iContractTranslation
														}
														onChange={(e) => {
															setFormData((prev) => ({
																...prev,
																translationServices: {
																	...prev.translationServices,
																	specializations: {
																		...prev.translationServices
																			?.specializations,
																		iContractTranslation: e.target.checked,
																	},
																},
															}));
														}}
														width='full'
													/>
												</div>
											)}
										</div>
									</FormSection>
								)}

								{/* Notes Or Special Requirements */}
								<FormSection
									title='Notes Or Special Requirements'
									icon='fa-clipboard-list'>
									<div className='flex justify-between items-center w-full gap-4'>
										<label
											className='block font-bold text-base flex-shrink-0'
											style={{ minWidth: "50%" }}>
											{renderLabel(
												"Any License Number, Insurance Requirements, or Job Minimums We Should Know About:",
											)}
										</label>
										<TextInput
											name='notesOrSpecialRequirements'
											value={formData.notesOrSpecialRequirements}
											onChange={handleChange}
											width='435px'
										/>
									</div>

									<div className='flex items-center gap-4 justify-between'>
										<label className='block font-bold text-base'>
											{renderLabel(
												"Upload Your Service Fee Sheet (If Available):",
											)}
										</label>
										<FileUpload
											name='serviceFeeSheet'
											onChange={handleFileChange}
											label='Attach Your Service Fee Sheet Here'
											accept='.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png'
											width='432px'
										/>
									</div>

									<p className='text-md italic'>
										<span className='text-[#FD7702] font-bold'>
											{renderLabel(
												`~ (Optional - Helps Us Understand Your Scope and Pricing
											for Future Assignments)`,
												"teal",
											)}
										</span>
									</p>

									<div className='flex items-center gap-4 justify-between'>
										<label className='block font-bold text-base'>
											Licensed?
										</label>
										<div className='flex items-center'>
											<RadioGroup
												name='licensed'
												value={formData.licensed}
												onChange={handleChange}
												options={[
													{
														value: "yes",
														label: "Yes",
														color: "teal",
														width: "100px",
													},
													{
														value: "no",
														label: "No",
														color: "orange",
														width: "100px",
													},
												]}
												width='auto'
												gridClass='mr-5'
											/>
											<div className='ml-4'>
												<TextInput
													name='licenseNumber'
													value={formData.licenseNumber}
													onChange={handleChange}
													label='License #:'
													width='532px'
													inputClass='ml-2'
												/>
											</div>
										</div>
									</div>
									<div className='flex items-center gap-4 justify-between'>
										<label className='block font-bold text-base'>
											Insured?
										</label>
										<div className='flex items-center'>
											<RadioGroup
												name='insuredSecond'
												value={formData.insuredSecond}
												onChange={handleChange}
												options={[
													{
														value: "yes",
														label: "Yes",
														color: "teal",
														width: "100px",
													},
													{
														value: "no",
														label: "No",
														color: "orange",
														width: "100px",
													},
												]}
												width='auto'
												gridClass='mr-4'
											/>
											<label className='block font-bold text-base'>
												{renderLabel("Insurance #:")}
											</label>

											<div className='ml-3'>
												<FileUpload
													name='coiFile'
													onChange={handleFileChange}
													label='Upload Certificate of Insurance (COI)'
													accept='.pdf,.jpg,.png'
													width='430px'
												/>
											</div>
										</div>
									</div>

									<div className='flex items-center gap-4 justify-between'>
										<label className='block font-bold text-base'>Bonded?</label>
										<div className='flex items-center'>
											<div>
												<RadioGroup
													name='bonded'
													value={formData.bonded}
													onChange={handleChange}
													options={[
														{
															value: "yes",
															label: "Yes",
															color: "teal",
															width: "100px",
														},
														{
															value: "no",
															label: "No",
															color: "orange",
															width: "100px",
														},
													]}
													width='auto'
													gridClass='mr-14'
												/>
											</div>
											<label className='block font-bold text-base w-max mx-1'>
												{renderLabel("Bond #:")}
											</label>
											<div className='flex gap-2 w-[437px]'>
												<TextInput
													name='bondNumber'
													value={formData.bondNumber}
													onChange={handleChange}
													inputClass='ml-2'
												/>
												<FileUpload
													name='bondCertFile'
													onChange={handleFileChange}
													label='Upload Bond'
													accept='.pdf,.jpg,.png'
													width='300px'
												/>
											</div>
										</div>
									</div>

									<TextInput
										name='suretyCompany'
										value={formData.suretyCompany}
										onChange={handleChange}
										label='Surety Company:'
										width='full'
									/>
								</FormSection>

								{/* Legal & Ethical Conduct Agreements */}
								<FormSection
									title='Legal & Ethical Conduct Agreements'
									icon='fa-balance-scale'>
									<RadioGroup
										name='courtSupervisedUnderstand'
										value={formData.courtSupervisedUnderstand}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "70px",
											},
										]}
										label='Do You Understand that the Jobs You May Be Assigned Are Court-Supervised and Your Work May Be Reviewed by an Attorney or Judge?'
										width='full'
										containerClass='flex justify-between items-center'
										labelClass='w-[950px] text-justify'
									/>

									<RadioGroup
										name='notifyAgentSensitive'
										value={formData.notifyAgentSensitive}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "70px",
											},
										]}
										label='Will You Notify the Agent Immediately if You Find Any Sensitive Documents, Cash, Weapons, or Personal Valuables?'
										width='full'
										containerClass='flex justify-between items-center'
										labelClass='w-[950px] text-justify'
									/>

									<RadioGroup
										name='agreeNotToTakeItems'
										value={formData.agreeNotToTakeItems}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "70px",
											},
										]}
										label='Do You Agree Not to Take, Gift, Donate or Remove Any Items Unless Instructed in Writing by the Estate Rep or Agent?'
										width='full'
										containerClass='flex justify-between items-center'
										labelClass='w-[950px] text-justify'
									/>
									<RadioGroup
										name='notifyAgentSensitive'
										value={formData.notifyAgentSensitive}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "70px",
											},
										]}
										label='Do You Agree to Take Clear, Timestamped Photos of Your Assigned Work Before and After Completion and Send Them to Us Via Text or Email when Requested? — This Helps Ensure Transparency and Protects All Parties Involved.'
										width='full'
										containerClass='flex justify-between items-center'
										labelClass='w-[950px] text-justify'
									/>
									<RadioGroup
										name='agreeToIndemnify'
										value={formData.agreeToIndemnify}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "70px",
											},
										]}
										label='Do You Agree to Indemnify and Hold Harmless the Real Estate Agent and Estate Representative for Any Damages Caused by Your Work?'
										width='full'
										containerClass='flex justify-between items-center'
										labelClass='w-[950px] text-justify'
									/>

									<RadioGroup
										name='understandNoGuarantee'
										value={formData.understandNoGuarantee}
										onChange={handleChange}
										options={[
											{
												value: "yes",
												label: "Yes",
												color: "teal",
												width: "80px",
											},
											{
												value: "no",
												label: "No",
												color: "orange",
												width: "70px",
											},
										]}
										label='Do You Understand that Submission of this Form does not Guarantee Work or Listing on the Approved Vendor List?'
										width='full'
										containerClass='flex justify-between items-center'
										labelClass='w-[950px] text-justify'
									/>
								</FormSection>

								<div className='pt-7 pb-9'></div>

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
				<div className='flex justify-center mt-6'>
					<button
						className='bg-[#0097A7] text-xl font-bold text-white px-5 py-2 rounded hover:bg-[#1f8a8b] transition-colors disabled:opacity-50'
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
}

export default Form2;
