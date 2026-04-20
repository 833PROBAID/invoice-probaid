const PageHeader = ({ title = "", subText = "", img = "" }) => {
	return (
		<div
			className='relative z-0 border-4 border-colorTeal rounded-lg shadow-lg overflow-hidden'
			style={{
				lineHeight: "1.3rem",
			}}>
			<img
				src={img}
				alt={title}
				className='w-full h-[200px] sm:h-[70vh] object-cover'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center'>
				<p className='text-center text-md sm:text-3xl md:text-5xl font-bold text-white p-2 xs:p-3 md:p-4 max-w-[90%] md:max-w-6xl overflow-hidden break-words'>
					{title.split("/n").map((line, index) => (
						<div key={index}>{line}</div>
					))}
				</p>
				<p className='text-center text-sm sm:text-2xl font-bold text-white max-w-[90%] md:max-w-6xl overflow-hidden break-words'>
					{subText}
				</p>
			</div>
		</div>
	);
};

export default PageHeader;
