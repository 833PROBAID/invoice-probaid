import { Typography } from "@material-tailwind/react";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const testimonials = [
	{
		id: 1,
		name: "Janice P.",
		position: "",
		testimonial:
			"Working with Tony made a difficult time so much easier. His knowledge and support was invaluable.",
		image: "",
		rating: 5,
	},
	{
		id: 2,
		name: "Probate Referee Stephen B.",
		position: "",
		testimonial:
			"I trust 833PROBAID for all my probate referrals. They go above and beyond for their clients.",
		image: "",
		rating: 5,
	},
];

const StarRating = ({ rating }) => {
	return (
		<div className='flex items-center mb-4'>
			{Array.from({ length: 5 }, (_, index) => (
				<i
					key={index}
					className={`fas fa-star ${
						index < rating ? "text-colorOrange" : ""
					} text-xl`}></i>
			))}
		</div>
	);
};

const Testimonials = () => {
	return (
		<>
			<Seo
				title="Client Testimonials"
				description="Read what our clients have to say about their experience with 833PROBAID. Real testimonials from satisfied customers who have worked with us through the probate process."
				pathname="/testimonials"
			/>
			<div className='max-w-7xl mx-auto p-4'>
				<Navigation current='/testimonials' />
				<Typography className='text-4xl md:text-6xl font-extrabold mb-6 text-colorTeal text-center'>
					Client Testimonials
				</Typography>
				<Typography className='text-center text-colorOrange mb-8 text-lg md:text-xl '>
					See what our clients have to say about their experience with us.
				</Typography>
				<div className='grid grid-cols-1 md:grid-cols-2 items-center gap-8 min-h-[50vh]'>
					{testimonials.map(
						({ id, name, position, testimonial, image, rating }) => (
							<div
								key={id}
								className='rounded-lg shadow-lg p-6 flex flex-col items-center text-center bg-tealSoft bg-opacity-40 border-l-8 border-2 border-colorOrange cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105'>
								{/* <img
                                src={image}
                                alt={name}
                                className='w-24 h-24 rounded-full mb-4 object-cover border-2 border-gray-300'
                            /> */}
								<Typography className='font-semibold text-lg text-colorTeal mb-2'>
									{name}
								</Typography>
								{/*  <Typography className='italic  mb-2'>
                                {position}
                            </Typography> */}
								<StarRating rating={rating} />
								<Typography className=''>“{testimonial}”</Typography>
							</div>
						),
					)}
				</div>

				<Navigation current='/testimonials' />
			</div>
		</>
	);
};

export default Testimonials;
