import { useState } from "react";
import { TextInput } from "../components/SharedComponents";
import AiChatInterface from "../components/AiChatInterface";

const formatCurrency = (value) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);

const CourtConfirmationOverbidCalculator = () => {
	const [offerPrice, setOfferPrice] = useState("");
	const [downPayment, setDownPayment] = useState("");
	const [deposit, setDeposit] = useState("");
	const [results, setResults] = useState(null);
	const [errors, setErrors] = useState({});

	const validateInputs = () => {
		const newErrors = {};
		const offer = parseFloat(offerPrice);
		const down = parseFloat(downPayment);

		if (!offerPrice.trim() || isNaN(offer) || offer <= 0) {
			newErrors.offerPrice = "Please enter a valid offer price greater than $0";
		}
		if (!downPayment.trim() || isNaN(down) || down < 0) {
			newErrors.downPayment = "Please enter a valid down payment amount";
		}
		if (down > offer) {
			newErrors.downPayment = "Down payment cannot exceed offer price";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const calculate = () => {
		if (!validateInputs()) return;

		const offer = parseFloat(offerPrice);
		const down = parseFloat(downPayment);
		const depositValue = deposit ? parseFloat(deposit) : 0;

		const base = 500;
		const firstTenK = Math.min(offer, 10000) * 0.1;
		const remaining = Math.max(offer - 10000, 0) * 0.05;
		const minOverbid = offer + base + firstTenK + remaining;
		const cashierCheck = minOverbid - down;
		const premium = minOverbid - offer;
		const liquidityGap = Math.max(cashierCheck - depositValue, 0);
		const leverageRatio = Math.round((down / offer) * 100);

		setResults({
			minOverbid,
			cashierCheck,
			premium,
			liquidityGap,
			leverageRatio,
			depositValue,
			breakdown: {
				offer,
				base,
				firstTenK,
				remaining,
			},
		});
	};

	const clearForm = () => {
		setOfferPrice("");
		setDownPayment("");
		setDeposit("");
		setResults(null);
		setErrors({});
	};

	return (
		<div className='max-w-7xl mx-auto p-4'>
			<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
				<div className='bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white p-6'>
					<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
						<div>
							<p className='text-xs uppercase tracking-[0.3em] text-white/80'>
								Court Confirmation Toolkit
							</p>
							<h1 className='text-2xl md:text-4xl font-extrabold mt-1'>
								Court Confirmation Overbid Calculator
							</h1>
							<p className='text-sm md:text-base text-white/90 mt-3 max-w-3xl'>
								Model the statutory minimum overbid and funding requirements before
								you step into court.
							</p>
						</div>
						<div className='bg-white/15 rounded-lg px-5 py-4 text-center'>
							<p className='text-xs uppercase tracking-[0.2em] text-white/80'>
								Funding Snapshot
							</p>
							<p className='text-xl font-semibold mt-1'>
								Enter offer, down payment, and optional deposits to unlock analytics.
							</p>
						</div>
					</div>
				</div>

				<div className='p-6 space-y-8'>
					<div className='bg-white border border-gray-100 rounded-xl p-6 shadow-sm'>
						<div className='flex items-center mb-4'>
							<i className='fas fa-calculator text-[#FD7702] text-xl mr-3'></i>
							<h2 className='text-xl font-semibold text-[#0097A7]'>Property Details</h2>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
							<div>
								<TextInput
									name='offerPrice'
									value={offerPrice}
									onChange={(e) => setOfferPrice(e.target.value)}
									label='Offer Price ($):'
									type='number'
									width='full'
									placeholder='e.g., 150000'
									required
								/>
								{errors.offerPrice && (
									<p className='text-[#FD7702] text-sm mt-1'>{errors.offerPrice}</p>
								)}
							</div>
							<div>
								<TextInput
									name='downPayment'
									value={downPayment}
									onChange={(e) => setDownPayment(e.target.value)}
									label='Down Payment ($):'
									type='number'
									width='full'
									placeholder='e.g., 10000'
									required
								/>
								{errors.downPayment && (
									<p className='text-[#FD7702] text-sm mt-1'>{errors.downPayment}</p>
								)}
							</div>
							<TextInput
								name='deposit'
								value={deposit}
								onChange={(e) => setDeposit(e.target.value)}
								label='Deposit ($) (Optional):'
								type='number'
								width='full'
								placeholder='e.g., 5000'
							/>
						</div>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<button
								type='button'
								onClick={calculate}
								className='bg-[#0097A7] text-white px-8 py-3 rounded-md hover:bg-[#007A87] transition-colors duration-300 font-semibold text-lg'>
								Run Calculation
							</button>
							<button
								type='button'
								onClick={clearForm}
								className='border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:border-gray-400 transition-colors duration-300 font-semibold text-lg'>
								Reset Form
							</button>
						</div>
					</div>

					{results && (
						<div className='space-y-8'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div className='bg-gradient-to-br from-[#0097A7] to-[#007A87] text-white p-6 rounded-lg shadow-md'>
									<p className='text-xs uppercase tracking-[0.25em] text-white/80'>
										Minimum Overbid
									</p>
									<p className='text-3xl font-bold mt-2'>
										{formatCurrency(results.minOverbid)}
									</p>
									<p className='text-xs mt-2 text-white/80'>
										Premium over offer: {formatCurrency(results.premium)}
									</p>
								</div>
								<div className='bg-gradient-to-br from-[#FD7702] to-[#FD7702] text-white p-6 rounded-lg shadow-md'>
									<p className='text-xs uppercase tracking-[0.25em] text-white/80'>
										Cashier&apos;s Check Required
									</p>
									<p className='text-3xl font-bold mt-2'>
										{formatCurrency(results.cashierCheck)}
									</p>
									<p className='text-xs mt-2 text-white/80'>
										Down payment already credited
									</p>
								</div>
								<div className='bg-white border border-gray-100 p-6 rounded-lg shadow-sm'>
									<p className='text-xs uppercase tracking-[0.25em] text-[#007A87]'>
										Liquidity Gap
									</p>
									<p className='text-3xl font-bold text-[#007A87] mt-2'>
										{results.liquidityGap > 0
											? formatCurrency(results.liquidityGap)
											: "Fully Covered"}
									</p>
									<p className='text-xs text-gray-600 mt-2'>
										Deposit on file: {formatCurrency(results.depositValue || 0)}
									</p>
								</div>
							</div>

							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								<div className='bg-gray-50 p-6 rounded-lg border border-gray-100'>
									<h3 className='text-lg font-bold text-[#0097A7] mb-3'>Formula Breakdown</h3>
									<ul className='list-disc list-inside space-y-2 text-gray-700 leading-relaxed text-sm sm:text-base'>
										<li>Offer Price: {formatCurrency(results.breakdown.offer)}</li>
										<li>Base Amount: {formatCurrency(results.breakdown.base)}</li>
										<li>10% of first $10,000: {formatCurrency(results.breakdown.firstTenK)}</li>
										<li>5% of remaining balance: {formatCurrency(results.breakdown.remaining)}</li>
									</ul>
								</div>
								<div className='bg-white p-6 rounded-lg border border-gray-100 shadow-sm'>
									<h3 className='text-lg font-bold text-[#0097A7] mb-3'>Readiness Insights</h3>
									<ul className='space-y-2 text-sm text-gray-700'>
										<li>
											<span className='font-semibold text-[#0097A7]'>Leverage Ratio:</span> {results.leverageRatio}% of offer already funded.
										</li>
										<li>
											<span className='font-semibold text-[#FD7702]'>Premium Delta:</span> Court requires {formatCurrency(results.premium)} above the offer to open bidding.
										</li>
										<li>
											<span className='font-semibold text-[#007A87]'>Cashier&apos;s Check Plan:</span> Prepare {formatCurrency(results.cashierCheck)} by day of hearing.
										</li>
									</ul>
								</div>
							</div>

							<div className='bg-blue-50 p-6 rounded-lg border border-blue-100'>
								<h3 className='text-lg font-bold text-[#0097A7] mb-3'>Scenario Briefing</h3>
								<p className='text-sm text-gray-700 leading-relaxed'>
									For an offer of {formatCurrency(results.breakdown.offer)} with a down payment of {formatCurrency(parseFloat(downPayment))},
									the statutory minimum overbid equals {formatCurrency(results.minOverbid)}. The court expects cashier&apos;s check funds of
									{formatCurrency(results.cashierCheck)} after crediting your down payment. Keep proof of funds and cashier&apos;s check receipts handy
									for the confirmation hearing.
								</p>
							</div>

							<AiChatInterface
								contextData={results}
								contextLabel='Court Overbid Calculation'
							/>

							<p className='text-center text-xs text-gray-500 italic bg-yellow-50 p-4 rounded-lg'>
								Disclaimer: Confirm all figures with your attorney or probate referee before court submission.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CourtConfirmationOverbidCalculator;
