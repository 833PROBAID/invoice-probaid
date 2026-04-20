import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Reusable Item Card Component
const ItemCard = ({
	item,
	index,
	isNew,
	onUpdate,
	onAdd,
	onRemove,
	descriptionOptions,
}) => {
	const isAddMode = isNew;

	return (
		<div className='p-3 border-[3.5px] border-colorOrange mb-3'>
			<div className='flex items-center gap-2 mb-3'>
				{isAddMode ? (
					<>
						<i className='fas fa-plus-circle text-colorOrange text-xl'></i>
						<h3 className='font-bold text-base'>Add New Item</h3>
					</>
				) : (
					<>
						<div className='w-8 h-8 bg-colorOrange text-white rounded-full flex items-center justify-center font-bold text-sm'>
							{index + 1}
						</div>
						<h4 className='font-bold text-base'>Item {index + 1}</h4>
					</>
				)}
			</div>

			<div className='space-y-2'>
				<div>
					<label className='block font-bold text-base mb-1'>Description</label>
					<select
						className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-white focus:outline-colorOrange transition-colors mb-2 text-base'
						value={
							descriptionOptions.includes(item.description)
								? item.description
								: "Custom"
						}
						onChange={(e) => {
							if (e.target.value === "Custom") {
								onUpdate("description", "");
							} else {
								onUpdate("description", e.target.value);
							}
						}}>
						<option value=''>Select a service...</option>
						{descriptionOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
					{(!descriptionOptions.includes(item.description) ||
						item.description === "") && (
						<input
							type='text'
							className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-white focus:outline-colorOrange transition-colors text-base'
							placeholder='Enter custom description'
							value={item.description}
							onChange={(e) => onUpdate("description", e.target.value)}
						/>
					)}
				</div>
				<div className='grid grid-cols-2 gap-3'>
					<div>
						<label className='block font-bold text-base mb-1'>Quantity</label>
						<input
							type='number'
							min='1'
							className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-white focus:outline-colorOrange transition-colors text-base'
							value={item.quantity}
							onChange={(e) =>
								onUpdate("quantity", parseInt(e.target.value) || 1)
							}
						/>
					</div>
					<div>
						<label className='block font-bold text-base mb-1'>Price ($)</label>
						<input
							type='number'
							min='0'
							step='0.01'
							className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-white focus:outline-colorOrange transition-colors text-base'
							value={item.price}
							onChange={(e) =>
								onUpdate("price", parseFloat(e.target.value) || 0)
							}
						/>
					</div>
				</div>
			</div>

			<div className='flex justify-between items-center mt-3 pt-3 border-t-2 border-colorOrange'>
				<div className='flex items-center gap-2'>
					<span className='text-sm font-bold uppercase'>Total:</span>
					<span className='text-xl font-bold text-colorTeal'>
						${(item.quantity * item.price).toFixed(2)}
					</span>
				</div>
				{isAddMode ? (
					<button
						type='button'
						onClick={onAdd}
						className='bg-colorOrange hover:bg-opacity-90 text-white font-bold py-2 px-6 uppercase transition-all duration-200'>
						<i className='fas fa-plus mr-2'></i>Add Item
					</button>
				) : (
					<button
						type='button'
						onClick={onRemove}
						className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 uppercase transition-all duration-200'>
						<i className='fas fa-trash mr-2'></i>Remove
					</button>
				)}
			</div>
		</div>
	);
};

ItemCard.propTypes = {
	item: PropTypes.shape({
		description: PropTypes.string.isRequired,
		quantity: PropTypes.number.isRequired,
		price: PropTypes.number.isRequired,
		id: PropTypes.number,
	}).isRequired,
	index: PropTypes.number,
	isNew: PropTypes.bool.isRequired,
	onUpdate: PropTypes.func.isRequired,
	onAdd: PropTypes.func,
	onRemove: PropTypes.func,
	descriptionOptions: PropTypes.array.isRequired,
};

const InvoiceGenerator = () => {
	const [invoiceData, setInvoiceData] = useState({
		billFrom: "",
		billTo: "",
		invoiceNumber: "",
		issuedDate: new Date().toISOString().split("T")[0],
		items: [],
		tax: 0,
		termsAndConditions:
			"Payment is due within 30 days of invoice date. Late payments may be subject to additional fees.",
	});

	const [currentItem, setCurrentItem] = useState({
		description: "",
		quantity: 1,
		price: 0,
	});

	const [showPreview, setShowPreview] = useState(false);

	const descriptionOptions = [
		"Real Estate Consultation Services",
		"Probate Property Evaluation",
		"Property Marketing Services",
		"Document Preparation",
		"Legal Consultation",
		"Property Management Services",
		"Transaction Coordination",
		"Photography and Staging",
		"Administrative Services",
		"Custom",
	];

	const addItem = () => {
		if (
			currentItem.description &&
			currentItem.quantity > 0 &&
			currentItem.price >= 0
		) {
			setInvoiceData({
				...invoiceData,
				items: [...invoiceData.items, { ...currentItem, id: Date.now() }],
			});
			setCurrentItem({ description: "", quantity: 1, price: 0 });
		}
	};

	const removeItem = (id) => {
		setInvoiceData({
			...invoiceData,
			items: invoiceData.items.filter((item) => item.id !== id),
		});
	};

	const updateItem = (id, field, value) => {
		setInvoiceData({
			...invoiceData,
			items: invoiceData.items.map((item) =>
				item.id === id ? { ...item, [field]: value } : item,
			),
		});
	};

	const handleCurrentItemUpdate = (field, value) => {
		setCurrentItem({ ...currentItem, [field]: value });
	};

	const calculateSubtotal = () => {
		return invoiceData.items.reduce(
			(sum, item) => sum + item.quantity * item.price,
			0,
		);
	};

	const calculateTax = () => {
		return calculateSubtotal() * (invoiceData.tax / 100);
	};

	const calculateTotal = () => {
		return calculateSubtotal() + calculateTax();
	};

	const handleDownload = () => {
		window.print();
	};

	return (
		<>
			<Helmet>
				<title>Invoice Generator | 833PROBAID</title>
				<meta
					name='description'
					content='Generate professional invoices for probate and real estate services'
				/>
			</Helmet>

			<div className='min-h-screen bg-white'>
				<div className='w-full max-w-7xl mx-auto'>
					{/* Header Section */}
					<div className='w-full bg-colorTeal'>
						<div className='grid grid-cols-7 justify-center items-stretch py-8'>
							<div className='col-span-3 bg-white pr-12 py-2 pl-4 flex items-center'>
								<img
									src='/833PROBAID.png'
									alt='833PROBAID'
									className='w-full h-auto'
								/>
							</div>
							<div className='bg-colorOrange -ml-9 border-[21px] border-r-0 border-colorTeal text-white px-6 py-4 font-bold text-[3.7rem] uppercase col-span-4 rounded-l-full flex items-center justify-center'>
								Invoice Generator
							</div>
						</div>
					</div>

					{!showPreview ? (
						<div className='flex items-center justify-center w-full'>
							<div
								className='w-full bg-white border border-gray-200 shadow-md'
								style={{ margin: "0 auto" }}>
								<form className='relative mt-4 mx-5'>
									<div className='absolute left-2 top-10 bottom-10 w-[6px] bg-colorOrange'></div>
									{/* Basic Information */}
									<div className='mb-6'>
										<div className='relative bg-colorTeal py-2 pl-16 text-white font-semibold text-2xl uppercase mb-4'>
											<div className='absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[4rem] h-[4rem] rounded-full bg-colorOrange flex items-center justify-center z-10 border-[6px] border-colorTeal'>
												<i className='fas fa-info-circle flex items-center justify-center w-6 h-6'></i>
											</div>
											Basic Information
										</div>
										<div className='pl-12 space-y-3'>
											<div>
												<label className='block font-bold text-base mb-1'>
													Bill From <span className='text-red-600'>*</span>
												</label>
												<textarea
													className='w-full border-[3.5px] border-colorTeal p-2 bg-gray-200 focus:outline-colorOrange transition-colors'
													rows='4'
													placeholder='Your Name&#10;Your Company&#10;Address&#10;Email, Phone'
													value={invoiceData.billFrom}
													onChange={(e) =>
														setInvoiceData({
															...invoiceData,
															billFrom: e.target.value,
														})
													}
												/>
											</div>
											<div>
												<label className='block font-bold text-base mb-1'>
													Bill To <span className='text-red-600'>*</span>
												</label>
												<textarea
													className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-gray-200 focus:outline-colorOrange transition-colors text-base'
													rows='4'
													placeholder='Client Name&#10;Company&#10;Address&#10;Email, Phone'
													value={invoiceData.billTo}
													onChange={(e) =>
														setInvoiceData({
															...invoiceData,
															billTo: e.target.value,
														})
													}
												/>
											</div>
											<div className='grid md:grid-cols-2 gap-3'>
												<div>
													<label className='block font-bold text-base mb-1'>
														Invoice Number{" "}
														<span className='text-red-600'>*</span>
													</label>
													<input
														type='text'
														className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-gray-200 focus:outline-colorOrange transition-colors text-base'
														placeholder='INV-001'
														value={invoiceData.invoiceNumber}
														onChange={(e) =>
															setInvoiceData({
																...invoiceData,
																invoiceNumber: e.target.value,
															})
														}
													/>
												</div>
												<div>
													<label className='block font-bold text-base mb-1'>
														Issued Date <span className='text-red-600'>*</span>
													</label>
													<DatePicker
														selected={
															invoiceData.issuedDate
																? new Date(invoiceData.issuedDate)
																: null
														}
														onChange={(date) => {
															const formattedDate = date
																? date.toISOString().split("T")[0]
																: "";
															setInvoiceData({
																...invoiceData,
																issuedDate: formattedDate,
															});
														}}
														className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-gray-200 focus:outline-colorOrange transition-colors text-base'
														placeholderText='Select date'
														dateFormat='yyyy-MM-dd'
														wrapperClassName='w-full'
													/>
												</div>
											</div>
										</div>
									</div>

									{/* Items Section */}
									<div className='mb-6'>
										<div className='relative bg-colorTeal py-2 pl-16 text-white font-semibold text-2xl uppercase mb-4'>
											<div className='absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[4rem] h-[4rem] rounded-full bg-colorOrange flex items-center justify-center z-10 border-[6px] border-colorTeal'>
												<i className='fas fa-list flex items-center justify-center w-6 h-6'></i>
											</div>
											Items & Services
										</div>

										<div className='pl-12'>
											{/* Add New Item */}
											<ItemCard
												item={currentItem}
												isNew={true}
												onUpdate={handleCurrentItemUpdate}
												onAdd={addItem}
												descriptionOptions={descriptionOptions}
											/>

											{/* Items List */}
											{invoiceData.items.length > 0 && (
												<div className='mt-4 space-y-3'>
													<h3 className='font-semibold text-gray-800 text-base flex items-center gap-2 pl-4'>
														<i className='fas fa-list text-colorOrange'></i>
														Added Items ({invoiceData.items.length})
													</h3>
													{invoiceData.items.map((item, index) => (
														<ItemCard
															key={item.id}
															item={item}
															index={index}
															isNew={false}
															onUpdate={(field, value) =>
																updateItem(item.id, field, value)
															}
															onRemove={() => removeItem(item.id)}
															descriptionOptions={descriptionOptions}
														/>
													))}
												</div>
											)}
										</div>
									</div>

									{/* Tax and Terms */}
									<div className='mb-6'>
										<div className='relative bg-colorTeal py-2 pl-16 text-white font-semibold text-2xl uppercase mb-4'>
											<div className='absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-[4rem] h-[4rem] rounded-full bg-colorOrange flex items-center justify-center z-10 border-[6px] border-colorTeal'>
												<i className='fas fa-calculator flex items-center justify-center w-6 h-6'></i>
											</div>
											Tax & Terms
										</div>
										<div className='pl-12 space-y-3'>
											<div className='grid md:grid-cols-2 gap-4'>
												<div>
													<label className='block font-bold text-base mb-1'>
														Tax (%)
													</label>
													<input
														type='number'
														min='0'
														step='0.01'
														className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-gray-200 focus:outline-colorOrange transition-colors text-base'
														placeholder='0'
														value={invoiceData.tax}
														onChange={(e) =>
															setInvoiceData({
																...invoiceData,
																tax: parseFloat(e.target.value) || 0,
															})
														}
													/>
												</div>
												<div className='p-3 border-[3.5px] border-colorOrange'>
													<div className='flex items-center justify-between mb-2 pb-2 border-b border-gray-300'>
														<div className='text-sm font-bold'>Subtotal</div>
														<div className='text-lg font-bold text-gray-900'>
															${calculateSubtotal().toFixed(2)}
														</div>
													</div>
													<div className='flex items-center justify-between mb-2 pb-2 border-b border-gray-300'>
														<div className='text-sm font-bold'>
															Tax ({invoiceData.tax}%)
														</div>
														<div className='text-lg font-bold text-gray-900'>
															${calculateTax().toFixed(2)}
														</div>
													</div>
													<div className='pt-2'>
														<div className='flex items-center justify-between'>
															<div className='text-sm text-colorTeal font-bold uppercase'>
																Total Amount
															</div>
															<div className='text-2xl font-bold text-colorTeal'>
																${calculateTotal().toFixed(2)}
															</div>
														</div>
													</div>
												</div>
											</div>
											<div>
												<label className='block font-bold text-base mb-1'>
													Terms and Conditions
												</label>
												<textarea
													className='w-full border-[3.5px] border-colorTeal px-3 py-2 bg-gray-200 focus:outline-colorOrange transition-colors text-base'
													rows='4'
													placeholder='Enter payment terms, conditions, and any additional notes'
													value={invoiceData.termsAndConditions}
													onChange={(e) =>
														setInvoiceData({
															...invoiceData,
															termsAndConditions: e.target.value,
														})
													}
												/>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className='flex flex-col sm:flex-row justify-center gap-4 py-6 my-8'>
										<button
											onClick={() => setShowPreview(true)}
											className='bg-colorTeal text-xl font-bold text-white px-8 py-3 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
											disabled={
												!invoiceData.billFrom ||
												!invoiceData.billTo ||
												!invoiceData.invoiceNumber ||
												invoiceData.items.length === 0
											}>
											<i className='fas fa-eye mr-2'></i>Preview Invoice
										</button>
									</div>
									{(!invoiceData.billFrom ||
										!invoiceData.billTo ||
										!invoiceData.invoiceNumber ||
										invoiceData.items.length === 0) && (
										<p className='text-sm text-red-600 text-center mt-3 font-bold'>
											Please fill all required fields and add at least one item
										</p>
									)}

									{/* Footer Contact Information */}
									<div className='bg-colorTeal text-white py-1 pl-8 pr-1 z-10 absolute bottom-0 left-2 right-0'>
										<div className='flex gap-3 justify-evenly text-2xl font-bold'>
											<a
												href='tel:8337762243'
												className='flex items-center hover:text-colorOrange group text-center -ml-11'>
												<i className='fas fa-phone-volume text-4xl text-colorOrange group-hover:text-white mr-3'></i>
												<div className='flex flex-col items-end leading-tight'>
													<div className='tracking-wide'>(833) PROBAID</div>
													<div className='tracking-wider lowercase -mt-1 w-max'>
														7762243
													</div>
												</div>
											</a>
											<div className='border-r-2 border-white'></div>
											<a
												href='mailto:Info@833probaid.com'
												className='flex items-center border-white group'>
												<i className='fas fa-envelope text-colorOrange group-hover:text-white text-4xl mr-3'></i>
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
											<a
												href='https://www.833probaid.com'
												className='flex items-center group'>
												<i className='fas fa-globe text-colorOrange group-hover:text-white text-4xl mr-3'></i>
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
									<div className='pt-5 pb-9'></div>
								</form>
							</div>
						</div>
					) : (
						<div className='mx-4'>
							<InvoicePreview
								invoiceData={invoiceData}
								calculateSubtotal={calculateSubtotal}
								calculateTax={calculateTax}
								calculateTotal={calculateTotal}
								onBack={() => setShowPreview(false)}
								onDownload={handleDownload}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

const InvoicePreview = ({
	invoiceData,
	calculateSubtotal,
	calculateTax,
	calculateTotal,
	onBack,
	onDownload,
}) => {
	return (
		<div>
			{/* Action Buttons - Hide on print */}
			<div className='flex flex-col sm:flex-row justify-center gap-4 my-8 print:hidden'>
				<button
					onClick={onBack}
					className='bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded transition-all'>
					<i className='fas fa-arrow-left mr-2'></i>Back to Edit
				</button>
				<button
					onClick={onDownload}
					className='bg-colorOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded transition-all'>
					<i className='fas fa-download mr-2'></i>Download / Print
				</button>
			</div>

			{/* Invoice Preview */}
			<div
				className='bg-white shadow-2xl p-12 max-w-4xl mx-auto'
				id='invoice-content'>
				{/* Header */}
				<div className='mb-10'>
					<div className='flex justify-between items-start mb-8'>
						<div>
							<div className='mb-4'>
								<h1 className='text-6xl font-extrabold text-colorTeal tracking-tight'>
									INVOICE
								</h1>
								<div className='h-1 w-24 bg-colorOrange mt-2'></div>
							</div>
							<div className='space-y-1'>
								<p className='text-xl text-gray-800 font-bold'>833PROBAID</p>
								<p className='text-sm text-gray-600'>
									Professional Real Estate Services
								</p>
							</div>
						</div>
						<div className='text-right'>
							<div className='space-y-3'>
								<div>
									<div className='text-xs uppercase tracking-wider font-semibold mb-1 text-gray-600'>
										Invoice Number
									</div>
									<div className='text-2xl font-bold text-gray-900'>
										{invoiceData.invoiceNumber}
									</div>
								</div>
								<div>
									<div className='text-xs uppercase tracking-wider font-semibold mb-1 text-gray-600'>
										Issue Date
									</div>
									<div className='text-base font-semibold text-gray-900'>
										{new Date(invoiceData.issuedDate).toLocaleDateString(
											"en-US",
											{ year: "numeric", month: "long", day: "numeric" },
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='border-b-2 border-gray-200'></div>
				</div>

				{/* Bill From/To */}
				<div className='grid md:grid-cols-2 gap-8 mb-12'>
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<div className='w-8 h-8 bg-colorTeal rounded-full flex items-center justify-center'>
								<i className='fas fa-building text-white text-xs'></i>
							</div>
							<h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide'>
								From
							</h3>
						</div>
						<div className='pl-10'>
							<div className='text-gray-700 whitespace-pre-line leading-relaxed'>
								{invoiceData.billFrom}
							</div>
						</div>
					</div>
					<div>
						<div className='flex items-center gap-2 mb-4'>
							<div className='w-8 h-8 bg-colorOrange rounded-full flex items-center justify-center'>
								<i className='fas fa-user text-white text-xs'></i>
							</div>
							<h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide'>
								Bill To
							</h3>
						</div>
						<div className='pl-10'>
							<div className='text-gray-700 whitespace-pre-line leading-relaxed'>
								{invoiceData.billTo}
							</div>
						</div>
					</div>
				</div>

				{/* Items Table */}
				<div className='mb-10'>
					<table className='w-full'>
						<thead>
							<tr className='border-b-2 border-gray-300'>
								<th className='px-6 py-4 text-left font-bold uppercase tracking-wider text-xs text-gray-700'>
									Description
								</th>
								<th className='px-6 py-4 text-center font-bold uppercase tracking-wider text-xs text-gray-700'>
									Qty
								</th>
								<th className='px-6 py-4 text-right font-bold uppercase tracking-wider text-xs text-gray-700'>
									Rate
								</th>
								<th className='px-6 py-4 text-right font-bold uppercase tracking-wider text-xs text-gray-700'>
									Amount
								</th>
							</tr>
						</thead>
						<tbody>
							{invoiceData.items.map((item) => (
								<tr key={item.id} className='border-b border-gray-200'>
									<td className='px-6 py-4 text-gray-800'>
										{item.description}
									</td>
									<td className='px-6 py-4 text-center text-gray-800'>
										{item.quantity}
									</td>
									<td className='px-6 py-4 text-right text-gray-800'>
										${item.price.toFixed(2)}
									</td>
									<td className='px-6 py-4 text-right font-semibold text-gray-900'>
										${(item.quantity * item.price).toFixed(2)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Totals */}
				<div className='flex justify-end mb-12'>
					<div className='w-80'>
						<div className='space-y-2'>
							<div className='flex justify-between items-center py-2 border-b border-gray-300'>
								<span className='text-gray-700 text-sm font-semibold'>
									Subtotal
								</span>
								<span className='text-base font-semibold text-gray-900'>
									${calculateSubtotal().toFixed(2)}
								</span>
							</div>
							<div className='flex justify-between items-center py-2 border-b border-gray-300'>
								<span className='text-gray-700 text-sm font-semibold'>
									Tax ({invoiceData.tax}%)
								</span>
								<span className='text-base font-semibold text-gray-900'>
									${calculateTax().toFixed(2)}
								</span>
							</div>
							<div className='flex justify-between items-center py-3 border-t-2 border-gray-900'>
								<span className='text-base font-bold uppercase tracking-wide text-gray-900'>
									Total Due
								</span>
								<span className='text-2xl font-bold text-gray-900'>
									${calculateTotal().toFixed(2)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Terms and Conditions */}
				{invoiceData.termsAndConditions && (
					<div className='mb-10'>
						<h3 className='text-sm font-bold text-gray-800 uppercase tracking-wide mb-3'>
							Terms & Conditions
						</h3>
						<p className='text-gray-700 text-sm whitespace-pre-line leading-relaxed'>
							{invoiceData.termsAndConditions}
						</p>
					</div>
				)}

				{/* Footer */}
				<div className='border-t-2 border-gray-200 pt-8 mt-12'>
					<div className='text-center'>
						<p className='text-lg font-bold text-gray-800 mb-2'>
							Thank you for your business!
						</p>
						<p className='text-sm text-gray-600'>
							Questions? Contact us at{" "}
							<span className='font-bold text-colorTeal'>833-PROBAID</span>
						</p>
					</div>
				</div>
			</div>

			{/* Print Styles */}
			<style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
		</div>
	);
};

InvoicePreview.propTypes = {
	invoiceData: PropTypes.shape({
		billFrom: PropTypes.string.isRequired,
		billTo: PropTypes.string.isRequired,
		invoiceNumber: PropTypes.string.isRequired,
		issuedDate: PropTypes.string.isRequired,
		items: PropTypes.array.isRequired,
		tax: PropTypes.number.isRequired,
		termsAndConditions: PropTypes.string,
	}).isRequired,
	calculateSubtotal: PropTypes.func.isRequired,
	calculateTax: PropTypes.func.isRequired,
	calculateTotal: PropTypes.func.isRequired,
	onBack: PropTypes.func.isRequired,
	onDownload: PropTypes.func.isRequired,
};

export default InvoiceGenerator;
