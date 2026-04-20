import { Link } from "react-router-dom";

// Function to format text with bold sections marked by **
export const formatText = (text) => {
	if (!text) return null;

	// Split the text by ** markers
	const parts = text.split(/(\*\*.*?\*\*|\+\+.*?\+\+|--.*?--)/g);

	return parts.map((part, index) => {
		// Check if the part is enclosed in ** markers
		if (part.startsWith("**") && part.endsWith("**")) {
			// Remove the ** markers and return as bold
			return (
				<strong key={index} className='text-colorOrange font-bold'>
					{part.slice(2, -2)}
				</strong>
			);
		}
		if (part.startsWith("++") && part.endsWith("++")) {
			// Remove the ** markers and return as bold
			return (
				<span
					onClick={() => window.open("/Seller Guide.pdf", "_blank")}
					key={index}
					className='text-colorTeal uppercase underline decoration-4 underline-offset-4 decoration-colorTeal font-bold cursor-pointer'>
					{part.slice(2, -2)}
				</span>
			);
		}
		if (part.startsWith("-") && part.endsWith("-")) {
			// Remove the ** markers and return as bold
			return (
				<span
					onClick={() => window.open("/Seller Guide.pdf", "_blank")}
					key={index}
					className='text-colorTeal uppercase underline decoration-4 underline-offset-4 decoration-colorTeal font-bold cursor-pointer'>
					{part.slice(2, -2)}
				</span>
			);
		}
		return part;
	});
};

const IconAndTitle = ({ array }) => {
	return (
		<ul className='flex flex-col justify-center gap-6 sm:gap-8 mt-9 staggered-fade-in'>
			{array?.map((items) => (
				<li
					key={items.id}
					className='flex items-start gap-4 md:items-baseline rounded-lg shadow-xl p-4 transition-all duration-500 ease-in-out hover:scale-[1.02] bg-tealSoft bg-opacity-40 border-l-8 border-4 border-colorOrange cursor-pointer hover:shadow-2xl hover:border-colorTeal card-3d'>
					<span className='flex-shrink-0'>
						<i className='fa-regular fa-circle-check text-4xl text-colorTeal hidden sm:block icon-3d'></i>
					</span>
					<div className='p-2 rounded-md w-full pulse'>
						<p className='font-bold text-colorOrange text-3xl'>
							{formatText(items?.title)}
						</p>
						<p className='text-colorTeal font-bold text-xl'>
							{formatText(items?.description)}{" "}
							{items?.disclosure && (
								<Link
									to='/terms-of-service'
									className='text-colorOrange text-sm'>
									(See Terms of Service/Disclosure)
								</Link>
							)}
						</p>
						{items?.subtitle && (
							<p className='text-colorTeal font-bold text-xl mt-2 mb-4'>
								{formatText(items?.subtitle)}
							</p>
						)}{" "}
						<ul className='flex flex-col justify-center gap-2 mt-2'>
							{items?.text?.map((text, index) => (
								<li
									key={index}
									className='flex items-baseline gap-4 hover-scale slide-in-left'>
									<i className='fa-solid fa-turn-up rotate-90 text-colorOrange icon-3d'></i>
									<p className='text-colorTeal font-bold text-xl'>
										{formatText(text)}
									</p>
								</li>
							))}
						</ul>{" "}
						<ul className='flex flex-col justify-center gap-2 mt-2'>
							{items?.content?.map((term) => (
								<li
									key={term.title}
									className='flex items-baseline gap-4 hover-scale slide-in-right'>
									<i className='fa-solid fa-turn-up rotate-90 text-colorTeal icon-3d'></i>
									<p className='font-normal text-colorTeal text-xl'>
										<strong className='text-colorOrange font-bold text-xl'>
											{formatText(term.title)} :{" "}
										</strong>
										<span className='text-colorTeal font-bold'>
											{formatText(term.description)}{" "}
										</span>
									</p>
								</li>
							))}
						</ul>{" "}
						{items?.nested &&
							items?.nested?.map((nested) => (
								<div className='mt-4' key={nested.title}>
									<p className='font-bold text-colorOrange text-2xl'>
										{formatText(nested?.title)}
									</p>
									<ul className='flex flex-col justify-center gap-2 mt-2'>
										{nested?.text?.map((text, index) => (
											<li
												key={index}
												className='flex items-baseline gap-4 hover-scale slide-in-left'>
												<i className='fa-solid fa-turn-up rotate-90 text-colorOrange icon-3d'></i>
												<p className='text-colorTeal font-bold text-xl'>
													{formatText(text)}
												</p>
											</li>
										))}
									</ul>
								</div>
							))}
						{/* START: New block for nestedStyle2 */}
						{items?.nestedStyle2 && (
							<div className='mt-4 space-y-3'>
								{items.nestedStyle2.map((nestedItem, index) => (
									<div key={index}>
										<div className='flex items-baseline gap-4'>
											<i className='fa-solid fa-turn-up rotate-90 text-colorTeal icon-3d'></i>
											<p className='font-bold text-colorOrange text-xl mb-1'>
												{formatText(nestedItem.title)}
											</p>
										</div>
										{nestedItem.text && nestedItem.text.length > 0 && (
											<ul className='flex flex-col justify-center gap-2 mt-2 pl-7 slide-in-left'>
												{nestedItem.text.map((textItem, textIndex) => (
													<li
														key={textIndex}
														className='flex items-baseline gap-4 ml-1 hover-scale'>
														<i className='fa-solid fa-turn-up rotate-90 text-colorOrange'></i>
														<p className='text-colorTeal font-bold text-xl'>
															{formatText(textItem)}
														</p>
													</li>
												))}
											</ul>
										)}
									</div>
								))}
							</div>
						)}
						{/* END: New block for nestedStyle2 */}
						{items?.footer && (
							<p className='text-colorOrange font-bold text-xl mt-4 whitespace-pre-line'>
								{formatText(items?.footer)}
							</p>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

export default IconAndTitle;
