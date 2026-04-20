import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NewsletterModal from "./NewsletterModal";

const Footer = () => {
	const [isModalOpen, setModalOpen] = useState(false);

	const closeModal = () => {
		setModalOpen(!isModalOpen);
		localStorage.setItem("newsletterModalShown", new Date().toDateString());
	};

	const location = useLocation();
	if (location.pathname.includes("dashboard")) return null;

	return (
		<footer className='pt-12 pb-5 mt-7 px-2 sm:px-8 text-center border-t border-colorTeal bg-tealSoft bg-opacity-50 font-[500]'>
			<NewsletterModal isOpen={isModalOpen} onClose={closeModal} />
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 lg:gap-6 max-w-7xl mx-auto'>
				{/* Company Info */}
				<div>
					<h3 className='text-2xl font-semibold mb-4 text-colorOrange uppercase'>
						Your Trusted Partner
					</h3>
					<p className='text-lg text-colorTeal'>
						Expert Probate, Trust, and Conservatorship Real Estate Services
						handled personally from start to finish. Trusted by attorneys.
						Relied on by families. Built to keep the process moving, even when
						things get complicated.
					</p>
				</div>

				{/* Contact Info */}
				<div className='flex flex-col items-center'>
					<h3 className='text-2xl font-semibold mb-4 text-colorOrange uppercase'>
						Contact Us
					</h3>
					<div>
						<div className='text-left text-lg max-w-[320px] mx-auto space-y-3 text-colorTeal'>
							<div>
								<td>
									<i className='fas fa-map-marker-alt mr-2 text-colorOrange'></i>
								</td>
								<td>
									<div className='flex flex-wrap min-w-[210px] ml-1'>
										<div>311 N. Robertson Blvd,&nbsp;</div>
										<div>Suite 444,&nbsp;</div>
										<div>Beverly Hills,&nbsp;</div>
										<div>CA 90211</div>
									</div>

									<span></span>
								</td>
							</div>
							<div>
								<td>
									<i className='fas fa-phone-volume mr-2 text-colorOrange'></i>
								</td>
								<td>
									<a href='tel:8337762243' className='flex items-center'>
										<div className='flex flex-col items-end'>
											<div>(833) PROBAID</div>
											<div className='text-colorOrange text-[0.95rem] font-semibold leading-[0.3em] tracking-[0.1em] lowercase'>
												7762243
											</div>
										</div>
									</a>
								</td>
							</div>
							<div>
								<td>
									<i className='fas fa-envelope mr-2 text-colorOrange'></i>
								</td>
								<td>
									<a href='mailto:Info@833PROBAID.com' className='mb-4'>
										Info@833PROBAID.com
									</a>
								</td>
							</div>
							<div>
								<td>
									<i className='fa-solid fa-globe mr-2 text-colorOrange'></i>
								</td>
								<td>
									<a href='https://www.833PROBAID.com' target='_blank'>
										www.833PROBAID.com
									</a>
								</td>
							</div>
						</div>
					</div>
				</div>

				{/* Newsletter Signup */}
				<div className='sm:col-span-2 md:col-span-1'>
					<h3 className='text-2xl font-semibold mb-4 text-colorOrange uppercase'>
						Join our Newsletter
					</h3>
					<p className='mb-4 text-lg text-colorTeal'>
						Stay up to date with the latest news and updates from{" "}
						<span className='text-colorOrange font-semibold'>
							833PROBAID<sup>TM</sup>
						</span>
						. Subscribe to our newsletter.
					</p>

					<div className='flex items-center justify-center'>
						<div
							className='relative group cursor-pointer mt-2'
							onClick={() => {
								/* setModalOpen(true); */
								window.open(
									"https://lp.constantcontactpages.com/sl/MC0GN7J",
									"_blank",
								);
							}}>
							<div className='relative w-56 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
								<img
									src='/logo_shape.svg'
									alt='Subscribe background'
									className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
								/>
								<span className='z-10 translate-y-[0.8rem]'>
									Subscribe{" "}
									<i className='fas fa-envelope ml-2 transition-transform duration-300 group-hover:translate-x-1'></i>
								</span>
							</div>
						</div>
						{/* <button
							onClick={() => {
								window.open(
									"https://lp.constantcontactpages.com/sl/MC0GN7J",
									"_blank",
								);
							}}
							className='border-colorOrange  hover:text-colorOrange hover:border-colorOrange border-2 px-4 py-2 rounded-lg flex items-center font-bold text-colorTeal uppercase text-sm lg:text-base mx-auto sm:mx-0'>
							<i className='fas fa-envelope mr-2'></i> Subscribe
						</button> */}
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div
				className='border-t-2 border-gray-300 mt-8 pt-8 text-center space-y-4'
				style={{
					lineHeight: "1.3rem",
				}}>
				<Link to='/' className='flex items-center justify-center mb-4'>
					<img
						src='/833PROBAID.png'
						alt='833PROBAID'
						className='w-64 mx-auto sm:mx-0'
					/>
				</Link>
				<div className='font-[600]'>
					&copy; {new Date().getFullYear()}{" "}
					<span className='text-colorOrange font-semibold'>
						833PROBAID<sup>TM</sup>{" "}
					</span>
					. All rights reserved.
				</div>
				<div className='font-[600]'>
					<Link
						to='/privacy-policy'
						className='text-colorOrange hover:underline'>
						Privacy Policy
					</Link>{" "}
					|
					<Link
						to='/terms-of-service'
						className='text-colorOrange hover:underline ml-2'>
						Terms of Service/Disclosure
					</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
