const HeroSection = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-tealSoft/20 dark:from-darkBackground dark:via-gray-900 dark:to-gray-800 relative overflow-hidden'>
			{/* Background Pattern */}
			<div className='absolute inset-0 opacity-5'>
				<div className='absolute top-10 left-10 w-72 h-72 bg-colorTeal rounded-full mix-blend-multiply filter blur-xl animate-pulse'></div>
				<div className='absolute top-10 right-10 w-72 h-72 bg-colorOrange rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000'></div>
				<div className='absolute -bottom-8 left-20 w-72 h-72 bg-colorTeal rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000'></div>
			</div>

			{/* Desktop & Tablet Layout */}
			<div className='hidden md:grid md:grid-cols-2 min-h-screen items-center container mx-auto px-4 lg:px-8 relative z-10 -mt-8'>
				{/* Left Side - Content */}
				<div className='flex flex-col justify-center space-y-8 px-4 lg:px-8'>
					<div className='space-y-6'>
						<div className='transform hover:scale-105 transition-transform duration-500'>
							<img
								src='/833PROBAID.png'
								alt='833PROBAID'
								className='w-80 lg:w-96 h-auto mx-auto md:mx-0 filter drop-shadow-2xl'
							/>
						</div>

						<div className='space-y-4'>
							<h1 className='text-2xl lg:text-3xl xl:text-4xl font-black leading-tight text-gray-900 dark:text-white'>
								<span className='bg-gradient-to-r from-colorTeal to-colorOrange bg-clip-text text-transparent'>
									Expert Probate, Trust, and Conservatorship
								</span>
								<br />
								<span className='text-gray-800 dark:text-gray-200'>
									Real Estate Services
								</span>
							</h1>

							<p className='text-lg lg:text-xl font-semibold leading-relaxed text-gray-700 dark:text-gray-300 max-w-2xl'>
								Handled personally from start to finish.
								<span className='text-colorTeal font-bold'>
									{" "}
									Trusted by attorneys.
								</span>
								<span className='text-colorOrange font-bold'>
									{" "}
									Relied on by families.
								</span>
								<br />
								Built to keep the process moving, even when things get
								complicated.
							</p>
						</div>

						<div className='pt-4'>
							<a href='#services'>
								<div className='relative group cursor-pointer'>
									<div className='relative w-64 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center transition-all duration-300 group-hover:scale-110'>
										<img
											src='/logo_shape.svg'
											alt='Learn more background'
											className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
										/>
										<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
											<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
											Get Started{" "}
											<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
										</span>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>

				{/* Right Side - Image */}
				<div className='flex items-center justify-center h-full w-full'>
					<div className='relative'>
						<div className='absolute inset-0 bg-gradient-to-br from-colorTeal/20 to-colorOrange/20 rounded-3xl blur-2xl transform rotate-6'></div>
						<img
							src='/tony.png'
							alt='Probate Services'
							className='relative w-full h-auto object-contain filter drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 rounded-2xl'
						/>
					</div>
				</div>
			</div>

			{/* Mobile Layout */}
			<div className='md:hidden min-h-screen flex flex-col relative z-10'>
				{/* Image Section */}
				<div className='relative h-[65vh] overflow-hidden'>
					<div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90 z-10'></div>
					<img
						src='/tony.png'
						alt='Probate Services'
						className='w-full h-full object-cover object-center filter brightness-110'
					/>
				</div>

				{/* Content Section */}
				<div className='flex-1 px-6 py-8 bg-white dark:bg-gray-900'>
					<div className='space-y-6'>
						<div className='transform hover:scale-105 transition-transform duration-500'>
							<img
								src='/833PROBAID.png'
								alt='833PROBAID'
								className='w-64 h-auto filter drop-shadow-xl mx-auto'
							/>
						</div>

						<div className='space-y-4 text-center'>
							<h1 className='text-xl sm:text-2xl font-black leading-tight text-gray-900 dark:text-white'>
								<span className='bg-gradient-to-r from-colorTeal to-colorOrange bg-clip-text text-transparent'>
									Expert Probate, Trust, and Conservatorship
								</span>
								<br />
								<span className='text-gray-800 dark:text-gray-200'>
									Real Estate Services
								</span>
							</h1>

							<p className='text-base sm:text-lg font-semibold leading-relaxed text-gray-700 dark:text-gray-300'>
								Handled personally from start to finish.
								<span className='text-colorTeal font-bold block'>
									{" "}
									Trusted by attorneys.
								</span>
								<span className='text-colorOrange font-bold block'>
									{" "}
									Relied on by families.
								</span>
								Built to keep the process moving, even when things get
								complicated.
							</p>
						</div>

						<div className='pt-6 flex justify-center'>
							<a href='#services'>
								<div className='relative group cursor-pointer'>
									<div className='relative w-64 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
										<img
											src='/logo_shape.svg'
											alt='Learn more background'
											className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
										/>
										<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
											<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
											Get Started{" "}
											<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
										</span>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
