import { useMemo, useState, useEffect } from "react";
import { RadioGroup } from "../Components/SharedComponents";
import AiChatInterface from "../Components/AiChatInterface";
import Swal from "sweetalert2";

const readinessBands = [
	{
		label: "Foundation Work Needed",
		tier: "Not Ready to Sell",
		min: 0,
		max: 39,
		message:
			"Critical foundation work must be completed before proceeding with a real estate sale. Focus on obtaining legal authority and securing basic protections.",
		cta: "Establish legal foundation first",
	},
	{
		label: "Preparation Phase",
		tier: "Early Groundwork",
		min: 40,
		max: 69,
		message:
			"You've begun the essential groundwork. Complete remaining items to prevent listing delays and expedite the sale process.",
		cta: "Complete preparation checklist",
	},
	{
		label: "Market Readiness Approaching",
		tier: "Pre-Listing",
		min: 70,
		max: 89,
		message:
			"You're approaching market readiness. Final alignment on timeline, insurance, and property access will position you for listing.",
		cta: "Finalize pre-listing requirements",
	},
	{
		label: "Listing Ready",
		tier: "Green Light",
		min: 90,
		max: 100,
		message:
			"You have completed all essential readiness steps. You are positioned to move forward with listing and marketing the property.",
		cta: "Proceed with listing strategy",
	},
];

const questionGroups = {
	foundation: ["letters", "certificate", "attorney"],
	readiness: ["insurance", "referee", "timeline"],
	operations: ["access", "occupant", "utilities", "secured"],
};

const questions = [
	{
		id: "letters",
		question:
			"Do you have Letters Testamentary (or Letters of Administration)?",
		group: "foundation",
		tooltip:
			"Probate authority must be issued before real estate actions can proceed.",
		recommendation:
			"Probate authority must be issued before real estate actions can proceed. Coordinate with probate counsel to obtain Letters.",
	},
	{
		id: "certificate",
		question: "Do you have certified copies of the death certificate?",
		group: "foundation",
		tooltip: "Certified copies are required for title, banking, and insurance.",
		recommendation:
			"Certified copies are required for title, banking, and insurance. Order multiple originals immediately.",
	},
	{
		id: "attorney",
		question: "Has probate counsel been retained?",
		group: "foundation",
		tooltip:
			"Retaining probate counsel helps manage filings, deadlines, and court approvals.",
		recommendation:
			"Retaining probate counsel helps manage filings, deadlines, and court approvals before sale.",
	},
	{
		id: "referee",
		question: "Has a probate referee been assigned (if required)?",
		group: "readiness",
		tooltip:
			"A referee valuation is required before listing in many probate cases.",
		recommendation:
			"A referee valuation is required before listing in many probate cases. Confirm assignment status.",
	},
	{
		id: "access",
		question: "Is property access established?",
		group: "operations",
		tooltip:
			"Keys, codes, and entry authorization are needed for inspections and preparation.",
		recommendation:
			"Secure authorized access for inspections, valuation, and preparation.",
	},
	{
		id: "occupant",
		question: "What is the occupant status of the property?",
		group: "operations",
		tooltip:
			"Occupancy affects timelines and strategy for listing preparation.",
		recommendation:
			"Occupancy affects timelines and strategy. Resolve access or relocation issues before listing.",
		isOccupancyQuestion: true,
	},
	{
		id: "insurance",
		question: "Is insurance updated to reflect estate ownership?",
		group: "readiness",
		tooltip:
			"Insurance must reflect estate or trust ownership to prevent coverage gaps.",
		recommendation:
			"Insurance must reflect estate or trust ownership to prevent coverage gaps.",
	},
	{
		id: "utilities",
		question: "Are utilities active and transferred appropriately?",
		group: "operations",
		tooltip:
			"Active utilities are required for showings, inspections, and insurance compliance.",
		recommendation:
			"Active utilities are required for showings, inspections, and insurance compliance.",
	},
	{
		id: "secured",
		question: "Is the property secured?",
		group: "operations",
		tooltip:
			"Locks, alarms, and monitoring reduce liability and insurance exposure.",
		recommendation:
			"Securing the property reduces liability and insurance exposure.",
	},
	{
		id: "timeline",
		question:
			"Has a sale timeline been aligned with counsel and beneficiaries?",
		group: "readiness",
		tooltip: "Aligned expectations prevent disputes and delays once listed.",
		recommendation:
			"Align expectations to prevent disputes and delays once the property is listed.",
	},
];

const getBand = (percentage) =>
	readinessBands.find(
		(band) => percentage >= band.min && percentage <= band.max,
	) || readinessBands[0];

const ExecutorReadinessQuiz = () => {
	const [answers, setAnswers] = useState({});
	const [results, setResults] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [modalSubmitted, setModalSubmitted] = useState(false);
	const [isSubmittingModal, setIsSubmittingModal] = useState(false);
	const [isCalculating, setIsCalculating] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		relationship: "",
		additionalInfo: "",
	});

	useEffect(() => {
		// Check if user is already registered in this session
		const existingUserId = sessionStorage.getItem('quizUserId');
		if (existingUserId) {
			setModalSubmitted(true);
			return;
		}
		
		// Check if URL has ?ref parameter
		// If ref exists = don't show popup (internal navigation)
		// If no ref = show popup (direct access)
		const urlParams = new URLSearchParams(window.location.search);
		const refParam = urlParams.get("ref");
		
		if (!refParam && !modalSubmitted) {
			setShowModal(true);
		}
	}, [modalSubmitted]);

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		setIsSubmittingModal(true);
		
		try {
			const response = await fetch('https://invoice.833probate.com/api/quiz/register-user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				// Save userId to sessionStorage (stays active while tab is open)
				sessionStorage.setItem('quizUserId', data.userId);
				sessionStorage.setItem('quizUserData', JSON.stringify(data.user));
				
				setModalSubmitted(true);
				setShowModal(false);
				
				// Show success message with Swal
				Swal.fire({
					icon: 'success',
					title: 'Registration Successful!',
					text: data.message || 'You can now proceed with the assessment.',
					confirmButtonColor: '#0097A7',
					confirmButtonText: 'Start Assessment'
				});
			} else {
				Swal.fire({
					icon: 'error',
					title: 'Registration Failed',
					text: data.message || 'Failed to register. Please try again.',
					confirmButtonColor: '#0097A7'
				});
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'An error occurred. Please try again.',
				confirmButtonColor: '#0097A7'
			});
		} finally {
			setIsSubmittingModal(false);
		}
	};

	const answeredCount = Object.keys(answers).length;
	const completionRate = Math.round((answeredCount / questions.length) * 100);

	const handleAnswer = (questionId, points) => {
		setAnswers((prev) => ({ ...prev, [questionId]: points }));
	};

	const groupScores = useMemo(() => {
		return Object.entries(questionGroups).map(([groupId, ids]) => {
			const earned = ids.reduce(
				(sum, questionId) => sum + (answers[questionId] || 0),
				0,
			);
			const max = ids.length * 10;
			return {
				groupId,
				label:
					groupId === "foundation"
						? "Court Foundations"
						: groupId === "readiness"
						? "Process Alignment"
						: "Operational Control",
				percent: max ? Math.round((earned / max) * 100) : 0,
			};
		});
	}, [answers]);

	const calculateReadiness = async () => {
		setIsCalculating(true);
		
		const totalPoints = Object.values(answers).reduce(
			(sum, points) => sum + points,
			0,
		);
		const percentage = Math.round((totalPoints / 100) * 100);
		const missingItems = questions
			.filter((q) => answers[q.id] === 0)
			.map((q) => q.question);
		const partialItems = questions
			.filter((q) => answers[q.id] === 5)
			.map((q) => q.question);
		const completeItems = questions
			.filter((q) => answers[q.id] === 10)
			.map((q) => q.question);

		const band = getBand(percentage);
		const focusAreas = groupScores
			.filter((score) => score.percent < 80)
			.sort((a, b) => a.percent - b.percent);

		let recommendations = [];
		if (percentage < 40) {
			recommendations = [
				"Obtain Letters Testamentary or Letters of Administration through probate court.",
				"Order certified death certificates (request at least 5-10 originals).",
				"Retain qualified probate counsel to manage court filings and deadlines.",
				"Establish property access and secure the premises immediately.",
				"Update property insurance to reflect estate or trust ownership.",
			];
		} else if (percentage < 70) {
			recommendations = [
				"Complete all partially finished tasks to prevent listing delays.",
				"Request probate referee assignment if required in your jurisdiction.",
				"Resolve occupancy issues and establish clear access protocols.",
				"Confirm utility transfers and ensure all services remain active.",
				"Schedule alignment meeting with counsel to establish sale timeline.",
			];
		} else if (percentage < 90) {
			recommendations = [
				"Finalize any remaining partial items to achieve full readiness.",
				"Schedule pre-listing property preparation (cleaning, repairs, staging assessment).",
				"Coordinate with counsel on disclosure requirements and court approval process.",
				"Begin vendor coordination for photography, inspections, and marketing.",
				"Communicate timeline and expectations clearly with all beneficiaries.",
			];
		} else {
			recommendations = [
				"Proceed with professional photography and marketing material preparation.",
				"Finalize listing strategy and pricing approach with your real estate agent.",
				"Schedule regular check-ins with counsel to maintain timeline compliance.",
				"Prepare all required disclosures and buyer information packets.",
				"Coordinate marketing launch date aligned with court approval timeline.",
			];
		}

		const strategicFocus = focusAreas.map((area) => {
			if (area.groupId === "foundation")
				return "Complete legal groundwork (letters, certificates, attorney alignment).";
			if (area.groupId === "readiness")
				return "Lock in referee, insurance, and milestone timeline commitments.";
			return "Stabilize access, occupant cooperation, utilities, and property security.";
		});

		const resultsData = {
			totalPoints,
			percentage,
			band,
			missingItems,
			partialItems,
			completeItems,
			recommendations,
			strategicFocus,
			focusAreas,
		};

		setResults(resultsData);

		// Submit to backend
		const userId = sessionStorage.getItem('quizUserId');
		if (userId) {
			try {
				const response = await fetch('https://invoice.833probate.com/api/quiz/submit', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId,
						answers,
						results: resultsData
					}),
				});

				const data = await response.json();
				
				if (response.ok) {
					console.log('Quiz submitted successfully:', data);
					// Show success message with Swal
					Swal.fire({
						icon: 'success',
						title: 'Your Result is Ready!',
						text: `You scored ${resultsData.percentage}% - ${resultsData.band.label}`,
						confirmButtonColor: '#0097A7',
						confirmButtonText: 'View Results'
					});
				} else {
					console.error('Failed to submit quiz:', data.message);
				}
			} catch (error) {
				console.error('Error submitting quiz:', error);
			}
		}
		
		setIsCalculating(false);
	};

	const resetQuiz = () => {
		setAnswers({});
		setResults(null);
	};

	const allAnswered = questions.every((q) => answers[q.id] !== undefined);

	return (
		<div className='max-w-7xl mx-auto p-4'>
			{/* Modal for collecting user information */}
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4'>
					<div className='bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
						<div className='bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white p-6 rounded-t-xl'>
							<h2 className='text-2xl font-bold'>Access Executor Readiness Tool</h2>
							<p className='text-sm text-white/90 mt-2'>
								Please provide your information to access this assessment tool.
							</p>
						</div>
						<form onSubmit={handleFormSubmit} className='p-6 space-y-4'>
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-1'>
									Full Name <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									name='name'
									value={formData.name}
									onChange={handleFormChange}
									required
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none'
									placeholder='John Doe'
								/>
							</div>
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-1'>
									Email Address <span className='text-red-500'>*</span>
								</label>
								<input
									type='email'
									name='email'
									value={formData.email}
									onChange={handleFormChange}
									required
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none'
									placeholder='john@example.com'
								/>
							</div>
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-1'>
									Phone Number <span className='text-red-500'>*</span>
								</label>
								<input
									type='tel'
									name='phone'
									value={formData.phone}
									onChange={handleFormChange}
									required
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none'
									placeholder='(555) 123-4567'
								/>
							</div>
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-1'>
									Relationship to Estate <span className='text-red-500'>*</span>
								</label>
								<select
									name='relationship'
									value={formData.relationship}
									onChange={handleFormChange}
									required
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none'>
									<option value=''>Select...</option>
									<option value='executor'>Executor</option>
									<option value='trustee'>Trustee</option>
									<option value='administrator'>Administrator</option>
									<option value='beneficiary'>Beneficiary</option>
									<option value='attorney'>Attorney</option>
									<option value='real-estate-agent'>Real Estate Agent</option>
									<option value='other'>Other</option>
								</select>
							</div>
							<div>
								<label className='block text-sm font-semibold text-gray-700 mb-1'>
									Additional Information
								</label>
								<textarea
									name='additionalInfo'
									value={formData.additionalInfo}
									onChange={handleFormChange}
									rows={3}
									className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none resize-none'
									placeholder='Any specific questions or concerns...'
								/>
							</div>
							<div className='pt-2'>
								<button
									type='submit'
									disabled={isSubmittingModal}
									className='w-full bg-[#0097A7] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#007A87] transition-colors duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
									{isSubmittingModal ? (
										<>
											<i className='fas fa-spinner fa-spin'></i>
											Submitting...
										</>
									) : (
										'Access Assessment Tool'
									)}
								</button>
							</div>
							<p className='text-xs text-gray-500 text-center'>
								Your information will be used to provide you with personalized guidance and support.
							</p>
						</form>
					</div>
				</div>
			)}

			<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
				<div className='bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white p-4 sm:p-6'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<p className='text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80'>
								Executor Command Center
							</p>
							<h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold mt-1'>
								Executor Readiness Intelligence
							</h1>
							<p className='text-sm sm:text-base md:text-lg mt-3 max-w-2xl text-white/90'>
								Track essential probate milestones, expose bottlenecks, and
								receive focus areas tailored to your current status.
							</p>
						</div>
						<div className='bg-white/15 rounded-lg p-4 text-center min-w-[220px]'>
							<p className='text-xs uppercase tracking-wider text-white/80'>
								Question Completion
							</p>
							<p className='text-4xl font-black mt-1'>{completionRate}%</p>
							<p className='text-xs mt-2 text-white/80'>
								{answeredCount} of {questions.length} checkpoints captured
							</p>
						</div>
					</div>
				</div>

				<div className='p-4 sm:p-6 space-y-8'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='bg-[#0097A7]/10 border border-[#0097A7]/20 rounded-xl p-4'>
							<p className='text-sm font-semibold text-[#0097A7] uppercase tracking-wide'>
								Current Score
							</p>
							<p className='text-4xl font-black text-[#0097A7] mt-2'>
								{results ? `${results.percentage}%` : "--"}
							</p>
							<p className='text-xs text-gray-600 mt-2'>
								Maximizes at 100% when every readiness lever is verified.
							</p>
						</div>
						<div className='bg-[#FD7702]/10 border border-[#FD7702]/20 rounded-xl p-4'>
							<p className='text-sm font-semibold text-[#FD7702] uppercase tracking-wide'>
								Completed Actions
							</p>
							<p className='text-4xl font-black text-[#FD7702] mt-2'>
								{results ? results.completeItems.length : 0}
							</p>
							<p className='text-xs text-gray-600 mt-2'>
								{results
									? `${results.partialItems.length} in progress · ${results.missingItems.length} pending`
									: "Capture each answer to unlock insights."}
							</p>
						</div>
						<div className='bg-[#007A87]/10 border border-[#007A87]/20 rounded-xl p-4'>
							<p className='text-sm font-semibold text-[#007A87] uppercase tracking-wide'>
								Next Move
							</p>
							<p className='text-xl font-bold text-[#007A87] mt-2'>
								{results ? results.band.cta : "Answer remaining checkpoints"}
							</p>
							<p className='text-xs text-gray-600 mt-2'>
								{results
									? results.band.message
									: "Complete the readiness check to unlock tailored guidance."}
							</p>
						</div>
					</div>

					<div>
						<div className='flex items-center justify-between flex-wrap gap-3 mb-4'>
							<h2 className='text-xl font-bold text-[#0097A7]'>
								Readiness Assessment
							</h2>
							<div className='flex gap-2'>
								<button
									type='button'
									onClick={resetQuiz}
									disabled={isCalculating}
									className='px-4 py-2 text-sm font-semibold border border-[#0097A7]/40 text-[#0097A7] rounded-md hover:border-[#0097A7] disabled:opacity-50'>
									Reset Assessment
								</button>
								<button
									type='button'
									onClick={calculateReadiness}
									disabled={!allAnswered || isCalculating}
									className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 flex items-center gap-2 ${
										allAnswered && !isCalculating
											? "bg-[#0097A7] text-white hover:bg-[#007A87]"
											: "bg-gray-200 text-gray-500 cursor-not-allowed"
									}`}>
									{isCalculating ? (
										<>
											<i className='fas fa-spinner fa-spin'></i>
											Calculating...
										</>
									) : (
										'Generate Insights'
									)}
								</button>
							</div>
						</div>
						<div className='space-y-6'>
							{questions.map((q, index) => (
								<div
									key={q.id}
									className='bg-gray-50 border border-gray-100 p-4 rounded-lg shadow-sm'>
									<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
										<div>
											<p className='text-xs uppercase tracking-wide text-gray-500'>
												Step {index + 1}
											</p>
											<h3 className='font-semibold text-[#0097A7] text-base sm:text-lg'>
												{q.question}
											</h3>
											<p className='text-xs text-gray-500 max-w-2xl'>
												{q.tooltip}
											</p>
										</div>
										<div className='text-sm font-semibold text-gray-600'>
											{answers[q.id] === 10 && (
												<span className='text-[#0097A7]'>Complete</span>
											)}
											{answers[q.id] === 5 && (
												<span className='text-[#FD7702]'>In Progress</span>
											)}
											{answers[q.id] === 0 && (
												<span className='text-[#FD7702]'>Not Started</span>
											)}
										</div>
									</div>
									<div className='mt-4'>
										<RadioGroup
											name={q.id}
											value={
												answers[q.id] !== undefined
													? answers[q.id].toString()
													: ""
											}
											onChange={(e) =>
												handleAnswer(q.id, parseInt(e.target.value, 10))
											}
											options={
												q.isOccupancyQuestion
													? [
															{ value: "10", label: "Vacant", color: "teal" },
															{
																value: "5",
																label: "Occupied - Cooperative",
																color: "orange",
															},
															{
																value: "0",
																label: "Occupied - Unresolved",
																color: "teal",
															},
													  ]
													: [
															{ value: "10", label: "Yes", color: "teal" },
															{
																value: "5",
																label: "In Progress",
																color: "orange",
															},
															{ value: "0", label: "No", color: "teal" },
													  ]
											}
											direction='horizontal'
											gap='gap-2 sm:gap-4'
											gridClass='flex-col sm:flex-row'
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='bg-[#0097A7]/10 border border-[#0097A7]/20 rounded-xl p-4'>
							<p className='text-sm font-semibold text-[#0097A7] uppercase tracking-wide'>
								Current Score
							</p>
							<p className='text-4xl font-black text-[#0097A7] mt-2'>
								{results ? `${results.percentage}%` : "--"}
							</p>
							<p className='text-xs text-gray-600 mt-2'>
								Maximizes at 100% when every readiness lever is verified.
							</p>
						</div>
						<div className='bg-[#FD7702]/10 border border-[#FD7702]/20 rounded-xl p-4'>
							<p className='text-sm font-semibold text-[#FD7702] uppercase tracking-wide'>
								Completed Actions
							</p>
							<p className='text-4xl font-black text-[#FD7702] mt-2'>
								{results ? results.completeItems.length : 0}
							</p>
							<p className='text-xs text-gray-600 mt-2'>
								{results
									? `${results.partialItems.length} in progress · ${results.missingItems.length} pending`
									: "Capture each answer to unlock insights."}
							</p>
						</div>
						<div className='bg-[#007A87]/10 border border-[#007A87]/20 rounded-xl p-4'>
							<p className='text-sm font-semibold text-[#007A87] uppercase tracking-wide'>
								Next Move
							</p>
							<p className='text-xl font-bold text-[#007A87] mt-2'>
								{results ? results.band.cta : "Answer remaining checkpoints"}
							</p>
							<p className='text-xs text-gray-600 mt-2'>
								{results
									? results.band.message
									: "Complete the readiness check to unlock tailored guidance."}
							</p>
						</div>
					</div>

					<div className='flex items-center justify-center gap-3'>
						<button
							type='button'
							onClick={resetQuiz}
							disabled={isCalculating}
							className='px-6 py-3 text-sm font-semibold border-2 border-[#0097A7]/40 text-[#0097A7] rounded-md hover:border-[#0097A7] hover:bg-[#0097A7]/5 transition-colors disabled:opacity-50'>
							Reset Assessment
						</button>
						<button
							type='button'
							onClick={calculateReadiness}
							disabled={!allAnswered || isCalculating}
							className={`px-8 py-3 rounded-md font-semibold text-base transition-colors duration-300 flex items-center gap-2 ${
								allAnswered && !isCalculating
									? "bg-[#0097A7] text-white hover:bg-[#007A87] shadow-lg"
									: "bg-gray-200 text-gray-500 cursor-not-allowed"
							}`}>
							{isCalculating ? (
								<>
									<i className='fas fa-spinner fa-spin'></i>
									Calculating...
								</>
							) : (
								results ? "Recalculate Insights" : "Generate Insights"
							)}
						</button>
					</div>
					{results && (
						<div className='space-y-6'>
							<div className='bg-gray-50 rounded-xl p-6 border border-gray-100'>
								<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
									<div>
										<p className='text-sm uppercase tracking-[0.25em] text-gray-500'>
											Readiness Tier
										</p>
										<h2 className='text-3xl font-black text-[#0097A7]'>
											{results.band.label}
										</h2>
										<p className='text-gray-600 mt-3 max-w-2xl leading-normal'>
											{results.band.message}
										</p>
									</div>
									<div className='bg-white border border-[#0097A7]/30 rounded-lg p-4 text-center min-w-[240px]'>
										<p className='text-xs uppercase text-[#0097A7] tracking-wide'>
											Readiness Score
										</p>
										<p className='text-5xl font-black text-[#0097A7]'>
											{results.percentage}%
										</p>
										<p className='text-xs text-gray-500 mt-2'>
											{results.totalPoints} / 100 execution points achieved
										</p>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								<div className='bg-white border border-gray-100 rounded-xl p-6 shadow-sm'>
									<h3 className='text-lg font-bold text-[#0097A7] mb-3'>
										Blocked Items & Action Steps
									</h3>
									<div className='space-y-4'>
										{results.missingItems.length > 0 && (
											<div>
												<p className='text-sm font-semibold text-red-600 uppercase tracking-wide mb-2'>
													Blocked (NO)
												</p>
												<div className='space-y-3'>
													{questions
														.filter((q) => answers[q.id] === 0)
														.map((q) => (
															<div
																key={q.id}
																className='bg-red-50 border-l-4 border-red-500 p-3 rounded'>
																<p className='font-semibold text-sm text-gray-800'>
																	{q.question}
																</p>
																<p className='text-xs text-gray-600 mt-1'>
																	{q.recommendation}
																</p>
															</div>
														))}
												</div>
											</div>
										)}
										{results.partialItems.length > 0 && (
											<div>
												<p className='text-sm font-semibold text-[#FD7702] uppercase tracking-wide mb-2'>
													In Progress
												</p>
												<div className='space-y-3'>
													{questions
														.filter((q) => answers[q.id] === 5)
														.map((q) => (
															<div
																key={q.id}
																className='bg-orange-50 border-l-4 border-[#FD7702] p-3 rounded'>
																<p className='font-semibold text-sm text-gray-800'>
																	{q.question}
																</p>
																<p className='text-xs text-gray-600 mt-1'>
																	{q.recommendation}
																</p>
															</div>
														))}
												</div>
											</div>
										)}
										{results.completeItems.length > 0 && (
											<div>
												<p className='text-sm font-semibold text-[#0097A7] uppercase tracking-wide mb-2'>
													Completed
												</p>
												<ul className='list-disc list-inside text-gray-700 space-y-1 text-sm'>
													{results.completeItems.map((item, index) => (
														<li key={index}>{item}</li>
													))}
												</ul>
											</div>
										)}
										{results.missingItems.length === 0 &&
											results.partialItems.length === 0 &&
											results.completeItems.length === 0 && (
												<p className='text-sm text-gray-600'>
													No items to display.
												</p>
											)}
									</div>
								</div>
								<div className='bg-white border border-gray-100 rounded-xl p-6 shadow-sm'>
									<h3 className='text-lg font-bold text-[#0097A7] mb-3'>
										Strategic Recommendations
									</h3>
									<ul className='list-disc list-inside space-y-2 text-gray-700 text-sm'>
										{results.recommendations.map((rec, index) => (
											<li key={index}>{rec}</li>
										))}
									</ul>
									{results.strategicFocus.length > 0 && (
										<div className='mt-4 border-t border-gray-100 pt-4'>
											<p className='text-sm font-semibold text-[#FD7702] uppercase tracking-wide'>
												Focus Signals
											</p>
											<ul className='list-disc list-inside text-gray-700 text-sm mt-2 space-y-1'>
												{results.strategicFocus.map((focus, index) => (
													<li key={index}>{focus}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>

							<AiChatInterface
								contextData={results}
								contextLabel='Executor Readiness Assessment'
							/>

							<div className='bg-gray-50 border border-gray-100 rounded-xl p-6'>
								<h3 className='text-lg font-bold text-[#0097A7] mb-4'>
									Capability Radar
								</h3>
								<div className='space-y-4'>
									{groupScores.map((score) => (
										<div key={score.groupId}>
											<div className='flex items-center justify-between text-sm font-semibold text-gray-600 mb-1'>
												<span>{score.label}</span>
												<span>{score.percent}%</span>
											</div>
											<div className='h-3 bg-gray-200 rounded-full overflow-hidden'>
												<div
													className='h-full bg-gradient-to-r from-[#0097A7] to-[#007A87]'
													style={{ width: `${score.percent}%` }}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ExecutorReadinessQuiz;
