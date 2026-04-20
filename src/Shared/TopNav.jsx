import { Navbar, Typography, Collapse } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const TopNav = () => {
	const [open, setOpen] = useState(false);

	// Toggle the mobile menu
	const handleToggle = () => setOpen(!open);

	const location = useLocation();
	if (location.pathname.includes("dashboard")) return null;

	return (
		<Navbar
			style={{
				zIndex: 999,
			}}
			className={`sticky w-full top-0 z-50 h-max max-w-full rounded-none py-1 transition duration-400 bg-tealSoft dark:bg-darkBackground dark:text-white dark:border-b-2 border-tealSoft shadow-md text-black`}>
			<div className='flex items-center justify-between max-w-7xl mx-auto'>
				<Typography className='mr-4 cursor-pointer py-1.5 font-medium'>
					<Link to='/' className='flex items-center'>
						<img
							src='/833PROBAID.png'
							alt='833PROBAID'
							className='w-44 sm:w-52'
						/>
					</Link>
				</Typography>

				{/* Desktop Navbar Items */}
				<div className='hidden md:flex items-center gap-8'>
					{" "}
					{/* Links */}
					<div className='flex space-x-6 font-bold'>
						<Link
							to='/'
							className={`
                                transition duration-300 px-2 py-3
                                ${
																	location.pathname === "/"
																		? "bg-colorTeal text-white font-bold hover:text-colorOrange hover:bg-transparent border-[3.5px] rounded-lg border-colorOrange"
																		: "text-colorOrange font-bold hover:text-colorTeal border-[3.5px] rounded-lg border-colorOrange"
																}
                            `}>
							Home
						</Link>
						{/*  <Link
                            to='/videos'
                            className={`
                                transition duration-300
                                ${location.pathname.includes("/videos")
                                    ? "text-colorOrange font-bold hover:text-colorTeal border-2 rounded-lg border-colorOrange px-2"
                                    : "text-colorTeal hover:text-colorOrange"
                                }
                            `}>
                            Videos
                        </Link> */}
						<Link
							to='/blogs'
							className={`
                                transition duration-300 px-2 py-3
                                ${
																	location.pathname.includes("/blog")
																		? "bg-colorTeal text-white font-bold hover:text-colorOrange hover:bg-transparent border-[3.5px] rounded-lg border-colorOrange"
																		: "text-colorOrange font-bold hover:text-colorTeal border-[3.5px] rounded-lg border-colorOrange"
																}
                            `}>
							Blogs
						</Link>
						{/*    <Link
                            to='/listings'
                            className={`
                                transition duration-300
                                ${location.pathname.includes("/listing")
                                    ? "text-colorOrange font-bold hover:text-colorTeal border-2 rounded-lg border-colorOrange px-2"
                                    : "text-colorTeal hover:text-colorOrange"
                                }`}>
                            Sold Listings
                        </Link> */}
					</div>
					<div className='flex space-x-4 justify-center text-colorTeal'>
						{/* Social Media Icons */}
						<a href='https://instagram.com' target='_blank' rel='noreferrer'>
							<i className='fab fa-instagram text-xl hover:text-colorOrange border-colorOrange transition duration-300 border-[3.5px] py-1 px-2 rounded-lg hover:border-colorOrange'></i>
						</a>{" "}
						<a href='https://linkedin.com' target='_blank' rel='noreferrer'>
							<i className='fab fa-linkedin  text-xl hover:text-colorOrange border-colorOrange transition duration-300 border-[3.5px] py-1 px-2 rounded-lg hover:border-colorOrange'></i>
						</a>
						<a href='https://facebook.com' target='_blank' rel='noreferrer'>
							<i className='fab fa-facebook-square  text-xl hover:text-colorOrange border-colorOrange transition duration-300 border-[3.5px] py-1 px-2 rounded-lg hover:border-colorOrange'></i>
						</a>
					</div>
					{/* Phone Link */}
					<a
						href='tel:8337762243'
						className='border-colorOrange hover:text-colorOrange hover:border-colorOrange border-[3.5px] px-3 py-1 rounded-lg flex items-center font-bold text-colorTeal uppercase text-sm lg:text-base hover:bg-opacity-80 transition duration-300 min-w-max'>
						<i className='fas fa-phone-volume mr-2 text-2xl'></i>
						<div className='flex flex-col items-end'>
							<div>(833) PROBAID</div>
							<div className='text-[0.9rem] leading-[0.5rem] tracking-[0.1em] lowercase'>
								7762243
							</div>
						</div>
					</a>
				</div>

				{/* Hamburger Menu for Mobile */}
				<div className='md:hidden'>
					<button
						onClick={handleToggle}
						className='text-teal-600 hover:text-colorOrange'>
						<i className='fas fa-bars text-3xl'></i>
					</button>
				</div>
			</div>

			{/* Mobile Menu using Collapse */}
			<Collapse open={open}>
				<div className='flex flex-col items-center p-4 space-y-4 md:hidden'>
					<Link
						to='/'
						className={`
                                transition duration-300 px-2 py-3
                                ${
																	location.pathname === "/"
																		? "bg-colorTeal text-white font-bold hover:text-colorOrange hover:bg-transparent border-2 rounded-lg border-colorOrange"
																		: "text-colorOrange font-bold hover:text-colorTeal border-2 rounded-lg border-colorOrange"
																}
                            `}>
						Home
					</Link>{" "}
					{/*  <Link
                        to='/videos'
                        className={`
                                transition duration-300
                                ${location.pathname.includes("/videos")
                                ? "text-colorOrange font-bold hover:text-colorTeal border-2 rounded-lg border-colorOrange px-2"
                                : "text-colorTeal hover:text-colorOrange"
                            }
                            `}>
                        Videos
                    </Link> */}
					<Link
						to='/blogs'
						className={`
                                 transition duration-300 px-2 py-3
                                ${
																	location.pathname.includes("/blog")
																		? "bg-colorTeal text-white font-bold hover:text-colorOrange hover:bg-transparent border-2 rounded-lg border-colorOrange"
																		: "text-colorOrange font-bold hover:text-colorTeal border-2 rounded-lg border-colorOrange"
																}
                            `}>
						Blogs
					</Link>
					{/*  <Link
                        to='/listings'
                        className={`
                                transition duration-300
                                ${location.pathname.includes("/listing")
                                ? "text-colorOrange font-bold hover:text-colorTeal border-2 rounded-lg border-colorOrange px-2"
                                : "text-colorTeal hover:text-colorOrange"
                            }`}>
                        Sold Listings
                    </Link> */}
					<div className='flex space-x-4 justify-center text-colorTeal'>
						{/* Social Media Icons */}
						<a href='https://instagram.com' target='_blank' rel='noreferrer'>
							<i className='fab fa-instagram text-xl hover:text-colorOrange border-colorOrange transition duration-300 border-2 py-1 px-2 rounded-lg hover:border-colorOrange'></i>
						</a>{" "}
						<a href='https://linkedin.com' target='_blank' rel='noreferrer'>
							<i className='fab fa-linkedin  text-xl hover:text-colorOrange border-colorOrange transition duration-300 border-2 py-1 px-2 rounded-lg hover:border-colorOrange'></i>
						</a>
						<a href='https://facebook.com' target='_blank' rel='noreferrer'>
							<i className='fab fa-facebook-square  text-xl hover:text-colorOrange border-colorOrange transition duration-300 border-2 py-1 px-2 rounded-lg hover:border-colorOrange'></i>
						</a>
					</div>
					{/* Phone Link */}
					<a
						href='tel:8337762243'
						className='border-colorOrange  hover:text-colorOrange hover:border-colorOrange border-2 px-3 py-1 rounded-lg flex items-center font-bold text-colorTeal uppercase text-sm lg:text-base hover:bg-opacity-80 transition duration-300'>
						<i className='fas fa-phone-volume mr-2 text-2xl'></i>
						<div className='flex flex-col items-end'>
							<div>(833) PROBAID</div>
							<div className='text-[0.65rem] leading-[0.5rem] tracking-[0.15em] lowercase'>
								776-2243
							</div>
						</div>
					</a>
				</div>
			</Collapse>
		</Navbar>
	);
};

export default TopNav;
