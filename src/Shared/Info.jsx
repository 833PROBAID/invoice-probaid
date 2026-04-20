const Info = () => {
	return (
		<div className='flex flex-col items-start space-y-3 my-8 text-colorOrange font-bold'>
			<a
				href='tel:8337762243'
				className='group flex items-center hover:text-colorTeal'>
				<i className='fas fa-phone-volume mr-3 text-2xl text-colorTeal group-hover:text-colorOrange'></i>
				<div className='flex flex-col items-end'>
					<div className='text-2xl'>(833) PROBAID</div>
					<div className='text-[1.4rem] font-bold leading-[0.7rem] tracking-[0.09em] lowercase text-colorTeal group-hover:text-colorOrange'>
						7762243
					</div>
				</div>
			</a>
			<a
				href='https://833probaid.com'
				target='_blank'
				rel='noopener noreferrer'
				className='group flex items-center hover:text-colorTeal transition-colors'>
				<i className='fas fa-globe mr-3 text-2xl text-colorTeal group-hover:text-colorOrange'></i>
				<span className='text-2xl'>833PROBAID.com</span>
			</a>
			<a
				href='mailto:Info@833PROBAID.com'
				className='group flex items-center hover:text-colorTeal transition-colors'>
				<i className='fas fa-envelope mr-3 text-2xl text-colorTeal group-hover:text-colorOrange'></i>
				<span className='text-2xl'>Info@833PROBAID.com</span>
			</a>
		</div>
	);
};

export default Info;
