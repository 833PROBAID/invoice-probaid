import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import ThankYou from "./ThankYou";
import HeroSection from "./HeroSection";
import { formatText } from "../../Components/IconAndTitle";

const Home = () => {
	return (
		<div className='max-w-7xl mx-auto'>
			{" "}
			<style>
				{`
					.card-3d {
						transform-style: preserve-3d;
						backface-visibility: hidden;
						transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
					}
					.card-3d:hover {
						transform: translateY(-12px) scale(1.05) rotateX(4deg) rotateY(2deg);
					}
					.icon-3d {
						transform-style: preserve-3d;
						backface-visibility: hidden;
						transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
					}
					.icon-3d:hover {
						transform: translateY(-8px) scale(1.15) rotateZ(15deg);
						filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15));
					}
					@keyframes floating {
						0%, 100% {
							transform: translate(-50%, -50%) translateY(0px);
						}
						50% {
							transform: translate(-50%, -50%) translateY(-12px);
						}
					}
					.floating {
						animation: floating 4s ease-in-out infinite;
					}
					@keyframes pulse {
						0%, 100% {
							transform: scale(1);
						}
						50% {
							transform: scale(1.05);
						}
					}
					.pulse {
						animation: pulse 3s ease-in-out infinite;
					}
					@keyframes fadeIn {
						from {
							opacity: 0;
							transform: translateY(20px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}
					.fade-in {
						animation: fadeIn 0.8s ease-out forwards;
					}
					.staggered-fade-in > * {
						opacity: 0;
						animation: fadeIn 0.8s ease-out forwards;
					}
					.staggered-fade-in > *:nth-child(1) { animation-delay: 0.1s; }
					.staggered-fade-in > *:nth-child(2) { animation-delay: 0.2s; }
					.staggered-fade-in > *:nth-child(3) { animation-delay: 0.3s; }
					.staggered-fade-in > *:nth-child(4) { animation-delay: 0.4s; }
					.staggered-fade-in > *:nth-child(5) { animation-delay: 0.5s; }
					.staggered-fade-in > *:nth-child(6) { animation-delay: 0.6s; }
					.staggered-fade-in > *:nth-child(7) { animation-delay: 0.7s; }
					.staggered-fade-in > *:nth-child(8) { animation-delay: 0.8s; }
					.staggered-fade-in > *:nth-child(9) { animation-delay: 0.9s; }
					.staggered-fade-in > *:nth-child(10) { animation-delay: 1s; }
					.staggered-fade-in > *:nth-child(11) { animation-delay: 1.1s; }
					.staggered-fade-in > *:nth-child(12) { animation-delay: 1.2s; }
					.staggered-fade-in > *:nth-child(13) { animation-delay: 1.3s; }
					.staggered-fade-in > *:nth-child(14) { animation-delay: 1.4s; }
					@keyframes gradientBg {
						0% {
							background-position: 0% 50%;
						}
						50% {
							background-position: 100% 50%;
						}
						100% {
							background-position: 0% 50%;
						}
					}					.gradient-animate {
						background-size: 200% 200%;
						animation: gradientBg 8s ease infinite;
					}
					.glass-effect {
						backdrop-filter: blur(10px);
						background: rgba(255, 255, 255, 0.8);
					}
					@keyframes slideInLeft {
						from {
							transform: translateX(-50px);
							opacity: 0;
						}
						to {
							transform: translateX(0);
							opacity: 1;
						}
					}
					@keyframes slideInRight {
						from {
							transform: translateX(50px);
							opacity: 0;
						}
						to {
							transform: translateX(0);
							opacity: 1;
						}
					}
					.slide-in-left {
						animation: slideInLeft 0.8s ease-out forwards;
					}
					.slide-in-right {
						animation: slideInRight 0.8s ease-out forwards;
					}
					@keyframes bounce {
						0%, 20%, 50%, 80%, 100% {
							transform: translateY(0);
						}
						40% {
							transform: translateY(-20px);
						}
						60% {
							transform: translateY(-10px);
						}
					}
					.bounce {
						animation: bounce 3s ease infinite;
					}
					.hover-scale {
						transition: transform 0.3s ease;
					}
					.hover-scale:hover {
						transform: scale(1.05);
					}
				`}
			</style>
			<HeroSection />
			<section className='py-16 bg-gradient-to-br from-gray-50 to-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-colorTeal mb-4'>
							Probate Real Estate Tools
						</h2>
						<p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
							Use these free tools to help navigate the probate process with
							confidence. From calculating overbids to assessing risks, get the
							insights you need.
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
						{[
							{
								to: "/court-confirmation-overbid-calculator",
								icon: "https://cdn-icons-png.flaticon.com/512/123/123403.png",
								text: "Overbid Calculator",
								description:
									"Calculate minimum overbid amounts and required cashier's checks for court confirmation.",
								color: "from-blue-500 to-blue-600",
							},
							{
								to: "/occupant-access-risk-analyzer",
								icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
								text: "Access Risk Analyzer",
								description:
									"Assess potential delays and risks related to property access and occupants.",
								color: "from-green-500 to-green-600",
							},
							{
								to: "/probate-property-insurance-risk-checker",
								icon: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
								text: "Insurance Risk Checker",
								description:
									"Evaluate insurance risks for vacant probate properties and get coverage recommendations.",
								color: "from-purple-500 to-purple-600",
							},
							{
								to: "/executor-readiness-quiz",
								icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
								text: "Executor Readiness Quiz",
								description:
									"Assess your preparedness to handle probate real estate responsibilities.",
								color: "from-indigo-500 to-indigo-600",
							},
						].map((tool, index) => (
							<div
								key={tool.to}
								className='group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden'
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<Link to={tool.to} className='block h-full'>
									{/* Icon Section */}
									<div className={`relative h-32 bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
										<div className='absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300'></div>
										<div className='relative z-10 transform group-hover:scale-110 transition-transform duration-300'>
											<img
												src={tool.icon}
												alt={tool.text}
												className='w-16 h-16 filter brightness-0 invert drop-shadow-lg'
											/>
										</div>
										{/* Decorative elements */}
										<div className='absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition-all duration-300'></div>
										<div className='absolute bottom-4 left-4 w-6 h-6 bg-white bg-opacity-15 rounded-full group-hover:bg-opacity-25 transition-all duration-300'></div>
									</div>

									{/* Content Section */}
									<div className='p-6'>
										<h3 className='text-xl font-bold text-colorTeal mb-3 group-hover:text-colorOrange transition-colors duration-300'>
											{tool.text}
										</h3>
										<p className='text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3'>
											{tool.description}
										</p>

										{/* CTA Button */}
										<div className='flex items-center justify-between'>
											<span className='text-colorTeal font-semibold text-sm group-hover:text-colorOrange transition-colors duration-300'>
												Use Tool
											</span>
											<div className='w-8 h-8 bg-colorTeal group-hover:bg-colorOrange rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1'>
												<i className='fas fa-arrow-right text-white text-xs'></i>
											</div>
										</div>
									</div>

									{/* Hover overlay effect */}
									<div className='absolute inset-0 bg-gradient-to-t from-colorTeal to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl'></div>
								</Link>
							</div>
						))}
					</div>

					{/* Bottom CTA */}
					<div className='text-center mt-12'>
						<p className='text-gray-600 mb-6'>
							Need help with probate real estate? Our experts are here to assist.
						</p>
						<Link
							to='/free-consultation'
							className='inline-flex items-center px-8 py-4 bg-colorTeal hover:bg-colorOrange text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
						>
							<span>Get Free Consultation</span>
							<i className='fas fa-arrow-right ml-2'></i>
						</Link>
					</div>
				</div>
			</section>
			<div className='-mt-14 ' id='services'>
				{" "}
				<section className='text-center container mx-auto p-4 staggered-fade-in'>
					<img
						src='/833PROBAID.png'
						alt='833PROBAID'
						className='w-72 mx-auto mb-4 pt-16 pulse'
					/>
					<h2 className='text-3xl md:text-5xl font-extrabold mb-6 tracking-wide text-colorOrange'>
						Welcome to{" "}
						<span className='text-colorTeal font-bold'>
							833PROBAID<sup>TM</sup>{" "}
						</span>{" "}
					</h2>
					<p className='text-lg text-justify font-bold '>
						If you&apos;ve just been put in charge of selling a loved one&apos;s property
						and you&apos;re not sure where to start, you&apos;re exactly where you need to
						be.
						<br />
						<br />
						I know how overwhelming this responsibility can feel, especially
						when you&apos;re still processing loss, managing paperwork, or trying to
						keep the peace among family members. My role is to remove the weight
						from your shoulders, protect the value of the estate, and guide you
						through the real estate process with clarity, compassion, and
						control.
						<br />
						<br />
						As a{" "}
						<span className='text-colorTeal font-bold'>
							Certified Probate Real Estate Specialist (C.P.R.E.S.)
						</span>
						, I bring the experience and structure families, conservators, and
						trustees need when timelines, legal steps, and emotions collide.
						Every case is different, and I’m here to simplify what’s next,
						eliminate confusion, and make sure nothing gets missed.
						<br />
						<br />
						I understand exactly what your legal role requires and what the
						court expects from you at every stage. That’s why I built a
						copyrighted, court-aligned system designed to streamline the entire
						process. Not just the real estate side, but the full execution of
						your fiduciary duties.
						<br />
						<br />
						Every tool I provide—from property prep to documentation,
						coordination, and timeline control—is built to keep attorneys
						informed, the court aligned, and your responsibilities on track
						without confusion, delays, or missed steps. You won’t find these
						materials anywhere else. They’re designed to protect the estate,
						reduce friction, and help you close out your role with total clarity
						and full transparency. My priority is to give you peace of mind, not
						more stress. Whether it’s handling the sale, coordinating access, or
						organizing documentation alongside your attorney, I’m here to make
						sure you feel supported and protected at every step. If you’re ready
						to talk, or you just want to understand your options, call me
						directly at{" "}
						<span className='text-colorOrange font-bold'>(833) PROBAID</span>,
						that’s{" "}
						<span className='text-colorOrange font-bold'>(833) 776-2243</span>,
						— for a{" "}
						<span className='text-colorOrange font-bold'>
							FREE, no-obligation consultation.
						</span>
						<br />
						<br />
						You’re not alone. And you don’t have to figure this out by yourself.
					</p>
				</section>
				<div className='py-12'>
					<ul className='grid grid-cols-1 mt-6 staggered-fade-in'>
						{[
							{
								to: "/commitment",
								icon: "https://cdn-icons-png.flaticon.com/512/12466/12466635.png ",
								text: "Why 833PROBAID™ is the Trusted Choice",
								subtext:
									"—Your Trusted Partner in Probate, Trust, and Conservatorship Real Estate",
								description:
									"Unmatched expertise in probate, trust, and conservatorship real estate — delivering results with precision, compassion, and integrity.",
							},
						].map(({ to, icon, text, subtext, description }) => (
							<li key={to} className='relative group mt-7'>
								{" "}
								<Link
									to={to}
									className='block h-full transform transition-transform duration-300 hover:scale-[1.02]'>
									<div className='relative rounded-xl shadow-xl border-4 border-colorTeal hover:border-colorOrange bg-gradient-to-b from-white to-gray-50 p-6 pt-20 flex flex-col items-center transition-all duration-500 ease-in-out group-hover:shadow-2xl h-full transform perspective-1000 card-3d'>
										<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 shadow-xl z-10 w-32 h-32 flex items-center justify-center bg-gradient-to-br from-colorOrange to-colorOrangeLight border-4 border-white transition-all duration-500 ease-in-out group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] group-hover:from-colorTeal group-hover:to-colorTeal floating icon-3d'>
											<img
												src={icon}
												alt={text}
												className='w-20 h-20 drop-shadow-xl filter brightness-110 contrast-110 transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-[-12deg]'
											/>
										</div>

										<div className='text-center flex-grow flex flex-col justify-between'>
											<div>
												<Typography className='font-extrabold text-2xl text-colorTeal  mb-1 group-hover:text-colorOrange transition-colors duration-300'>
													{text}
												</Typography>
												{subtext && (
													<Typography className='font-semibold text-lg text-colorOrange group-hover:text-colorTeal  mb-3'>
														{subtext}
													</Typography>
												)}
											</div>
											<Typography className=' leading-relaxed text-lg px-2 font-bold mb-6'>
												{description}
											</Typography>{" "}
											<div className='mt-auto'>
												<div className='relative w-60 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
													<img
														src='/logo_shape.svg'
														alt='Learn more background'
														className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
													/>
													<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
														<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
														Learn More{" "}
														<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
													</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</li>
						))}
					</ul>{" "}
					<ul className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 staggered-fade-in mt-14'>
						{[
							{
								to: "/understanding-Probate-sales",
								icon: "https://cdn-icons-png.flaticon.com/512/2436/2436837.png",
								text: `Understanding Probate Real Estate Sales`,
								subtext: "—The Clear Path to Protecting the Estate",
								description:
									"Master How the Process Really Works. Avoid Mistakes. Secure the Legacy.",
							},

							{
								to: "/streamlining-probate-real-estate-sales",
								icon: "https://cdn-icons-png.flaticon.com/512/18249/18249750.png",
								text: "Streamlining Probate Real Estate Sales with Precision.",
								subtext: "— From Listing to Closing Without the Excuses",
								description: formatText(
									"Get Your Probate Property ++SOLD++ Fast—No Delays, No Surprises, Just Results.",
								),
							},
							{
								to: "/understanding-conservatorship-sales",
								icon: "https://cdn-icons-png.flaticon.com/128/4762/4762311.png",
								text: "Understanding Conservatorship Real Estate Sales",
								subtext: "—Where Court Authority Meets Relentless Execution",
								description:
									"Zero Confusion. Zero Delay. Just Expert Execution When It Matters Most.",
							},
							{
								to: "/streamlining-conservatorship-real-estate-sales",
								icon: "https://cdn-icons-png.flaticon.com/512/3122/3122427.png",
								text: "Executing Court-Sensitive Conservatorship Real Estate Sales with Tactical Discipline",
								subtext: "—Built for Court. Engineered for Speed",
								description:
									"Verified Authority. Ruthless Control. Execution That Holds Up in Court.",
							},

							{
								to: "/trust-sale",
								icon: "https://cdn-icons-png.flaticon.com/128/6443/6443418.png",
								text: "Understanding Trust Real Estate Sales",
								description:
									"No Probate. No Confusion. Just Verified Authority and Clean Execution.",
								subtext: "— Clarity, Control, and Court-Free Execution",
							},
							{
								to: "/executing-trust-real-estate-sales",
								icon: "https://cdn-icons-png.flaticon.com/512/9751/9751010.png",
								text: "Executing Trust Real Estate Sales with Legacy in Mind",
								description:
									"This Isn’t Just a Sale — It’s a Fiduciary Duty to Maximize What Was Built.",
								subtext:
									"— Control the Asset. Protect the Value. Close Without a Courtroom.",
							},
							{
								to: "/reverse-mortgages",
								icon: "https://cdn-icons-png.flaticon.com/512/14597/14597332.png",
								text: "Reverse Mortgage Crisis Response — Probate, Conservatorship, and Trust Sales",
								subtext:
									"—Triggered Loans. Court Pressure. Zero Time to Stall.",
								description:
									"When equity is bleeding and deadlines are non-negotiable—execution starts now.",
							},

							{
								to: "/probate-decision-making-selling-vs-keeping-property",
								icon: "https://cdn-icons-png.flaticon.com/512/11251/11251412.png",
								text: "Deciding Whether to Sell or Keep",
								subtext:
									"—The Real Estate Strategy That Protects the Estate and Closes the Case",
								description:
									"Hold It, Sell It, or Rent It—Only One Protects the Estate. I'll Show You Which.",
							},
							{
								to: "/legal-and-ethical-considerations",
								icon: "	https://cdn-icons-png.flaticon.com/512/16648/16648631.png",
								text: "Legal & Ethical Compliance",
								subtext: "—Disclosure That Holds Up in Court, Not Just Escrow",
								description:
									"Built for Scrutiny. Protected by Process. Closed Without Flaws.",
							},
							{
								to: "/glossary-of-probate-terms",
								icon: "https://cdn-icons-png.flaticon.com/128/2541/2541988.png",
								text: "The 833-PROBAID™ Glossary",
								subtext:
									"—Real Terms. Real Authority. Built for Court-Controlled Real Estate.",
								description:
									"This isn’t a vocabulary list. It’s a tactical edge. Every word in this glossary is here to help executors, trustees, conservators, and attorneys cut delays, avoid escrow blowups, and stay in full control of the estate.",
							},
							{
								to: "/court-confirmation-overbid-calculator",
								icon: "https://cdn-icons-png.flaticon.com/512/123/123403.png",
								text: "Court Confirmation Overbid Calculator",
								subtext: "—Precise Calculations for Court Compliance",
								description:
									"Apply California Probate Code formulas with confidence. Get exact minimum overbid amounts and required cashier's check calculations for court confirmation.",
							},
							{
								to: "/occupant-access-risk-analyzer",
								icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
								text: "Occupant Access Risk Analyzer",
								subtext: "—Strategic Risk Assessment for Property Access",
								description:
									"Evaluate potential delays and challenges related to property occupants and access. Identify risks before they impact your probate timeline.",
							},
							{
								to: "/probate-property-insurance-risk-checker",
								icon: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
								text: "Probate Property Insurance Risk Checker",
								subtext: "—Protect Your Assets with Proper Coverage",
								description:
									"Assess insurance risks for vacant probate properties. Get recommendations for DP-1 or DP-3 vacancy coverage to protect against denied claims.",
							},
							{
								to: "/executor-readiness-quiz",
								icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
								text: "Executor Readiness Assessment",
								subtext: "—Comprehensive Preparedness Evaluation",
								description:
									"10-question assessment to evaluate your readiness for probate real estate responsibilities. Identify gaps and get actionable recommendations.",
							},

							{
								to: "/faqs",
								icon: "https://cdn-icons-png.flaticon.com/512/942/942751.png",
								text: "Frequently Asked Questions",
								subtext: "— Your Questions Answered",
								description:
									"Find answers to common questions about the probate process and services.",
							},

							{
								to: "/testimonials",
								icon: "	https://cdn-icons-png.flaticon.com/512/2013/2013695.png",
								text: "Client Testimonials",
								subtext: "— What Our Clients Say",
								description:
									"Read what our clients have to say about their experience with us.",
							},
							{
								to: "/vendor-intake",
								icon: "https://cdn-icons-png.flaticon.com/512/2589/2589749.png",
								text: "Vendor Partnership Opportunities",
								subtext: "— Work with 833PROBAID™",
								description:
									"Join Our Network of Trusted Vendors and Professionals to Serve Families in Need",
							},
							{
								to: "/your-resource-center",
								icon: "https://cdn-icons-png.flaticon.com/512/18252/18252074.png",
								text: "Your Resource Center",
								subtext: "— Trusted Guides & Professional Materials",
								description:
									"Trusted Guides & Professional Materials to Move Forward With Confidence",
							},
						].map(({ to, icon, text, subtext, description }) => (
							<li key={to} className='relative group mt-7'>
								{" "}
								<Link
									to={to}
									className='block h-full transform transition-transform duration-300 hover:scale-[1.02]'>
									<div className='relative rounded-xl shadow-xl border-4 border-colorTeal hover:border-colorOrange bg-gradient-to-b from-white to-gray-50 p-6 pt-20 flex flex-col items-center transition-all duration-500 ease-in-out group-hover:shadow-2xl h-full transform perspective-1000 card-3d'>
										<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 shadow-xl z-10 w-32 h-32 flex items-center justify-center bg-gradient-to-br from-colorOrange to-colorOrangeLight border-4 border-white transition-all duration-500 ease-in-out group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] group-hover:from-colorTeal group-hover:to-colorTeal floating icon-3d'>
											<img
												src={icon}
												alt={text}
												className='w-20 h-20 drop-shadow-xl filter brightness-110 contrast-110 transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-[-12deg]'
											/>
										</div>

										<div className='text-center flex-grow flex flex-col justify-between'>
											<div>
												<Typography className='font-extrabold text-2xl text-colorTeal  mb-1 group-hover:text-colorOrange transition-colors duration-300'>
													{text}
												</Typography>
												{subtext && (
													<Typography className='font-semibold text-lg text-colorOrange group-hover:text-colorTeal  mb-3'>
														{subtext}
													</Typography>
												)}
											</div>
											<Typography className=' leading-relaxed text-lg px-2 font-bold mb-6'>
												{description}
											</Typography>{" "}
											<div className='mt-auto'>
												<div className='relative w-60 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
													<img
														src='/logo_shape.svg'
														alt='Learn more background'
														className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
													/>
													<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
														<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
														Learn More{" "}
														<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
													</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</li>
						))}
					</ul>{" "}
					<ul className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 staggered-fade-in mt-14'>
						{[
							{
								to: "/contact",
								icon: "https://cdn-icons-png.flaticon.com/512/14946/14946653.png",
								text: "Contact Us",
								subtext: "— Get in Touch",
								description:
									"Get in touch with our team for any inquiries or further assistance.",
							},
							{
								to: "/free-consultation",
								icon: "https://cdn-icons-png.flaticon.com/512/6712/6712857.png",
								text: "833PROBAID™ Referral Intake",
								subtext:
									"— Court-Aligned Referrals. Attorney-Trusted Follow-Through.",
								description:
									"Protect your client. Protect your name. Refer probate, trust, or conservatorship real estate with precision and control. No guesswork. No dropped handoffs, just verified execution from intake to close.",
							},
						].map(({ to, icon, text, subtext, description }) => (
							<li key={to} className='relative group mt-7'>
								{" "}
								<Link
									to={to}
									className='block h-full transform transition-transform duration-300 hover:scale-[1.02]'>
									<div className='relative rounded-xl shadow-xl border-4 border-colorTeal hover:border-colorOrange bg-gradient-to-b from-white to-gray-50 p-6 pt-20 flex flex-col items-center transition-all duration-500 ease-in-out group-hover:shadow-2xl h-full transform perspective-1000 card-3d'>
										<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 shadow-xl z-10 w-32 h-32 flex items-center justify-center bg-gradient-to-br from-colorOrange to-colorOrangeLight border-4 border-white transition-all duration-500 ease-in-out group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] group-hover:from-colorTeal group-hover:to-colorTeal floating icon-3d'>
											<img
												src={icon}
												alt={text}
												className='w-20 h-20 drop-shadow-xl filter brightness-110 contrast-110 transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-[-12deg]'
											/>
										</div>

										<div className='text-center flex-grow flex flex-col justify-between'>
											<div>
												<Typography className='font-extrabold text-2xl text-colorTeal  mb-1 group-hover:text-colorOrange transition-colors duration-300'>
													{text}
												</Typography>
												{subtext && (
													<Typography className='font-semibold text-lg text-colorOrange group-hover:text-colorTeal  mb-3'>
														{subtext}
													</Typography>
												)}
											</div>
											<Typography className=' leading-relaxed text-lg px-2 font-bold mb-6'>
												{description}
											</Typography>{" "}
											<div className='mt-auto'>
												<div className='relative w-60 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
													<img
														src='/logo_shape.svg'
														alt='Learn more background'
														className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
													/>
													<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
														<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
														Learn More{" "}
														<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
													</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							</li>
						))}

						<li className='relative group mt-7 sm:col-span-2'>
							<a
								href='https://www.workforce-resource.com/dpr/pmt/CRMLS/TIGRAN_TONY_MKRTCHIAN/'
								target='_blank'
								className='block h-full transform transition-transform duration-300 hover:scale-[1.02]'>
								<div className='block h-full transform transition-transform duration-300 hover:scale-[1.02]'>
									<div className='relative rounded-xl shadow-xl border-4 border-colorTeal hover:border-colorOrange bg-gradient-to-b from-white to-gray-50 p-6 pt-20 flex flex-col items-center transition-all duration-500 ease-in-out group-hover:shadow-2xl h-full transform perspective-1000 card-3d'>
										<div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 shadow-xl z-10 w-32 h-32 flex items-center justify-center bg-gradient-to-br from-colorOrange to-colorOrangeLight border-4 border-white transition-all duration-500 ease-in-out group-hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] group-hover:from-colorTeal group-hover:to-colorTeal floating icon-3d'>
											<img
												src='https://cdn-icons-png.flaticon.com/128/1198/1198299.png'
												alt='Downpayment Assistance'
												className='w-20 h-20 drop-shadow-xl filter brightness-110 contrast-110 transition-transform duration-500 ease-in-out group-hover:scale-110 group-hover:rotate-[-12deg]'
											/>
										</div>

										<div className='text-center flex-grow flex flex-col justify-between'>
											<div>
												<Typography className='font-extrabold text-2xl text-colorTeal  mb-1 group-hover:text-colorOrange transition-colors duration-300'>
													Downpayment Assistance Programs
												</Typography>

												<Typography className='font-semibold text-lg text-colorOrange group-hover:text-colorTeal  mb-3'>
													— Helping You Buy Your Dream Home
												</Typography>
											</div>
											<Typography className=' leading-relaxed text-lg px-2 font-bold mb-6'>
												Check to see if you are eligible!
											</Typography>{" "}
											<div className='mt-auto'>
												<div className='relative w-60 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
													<img
														src='/logo_shape.svg'
														alt='Learn more background'
														className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
													/>
													<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
														<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
														Learn More{" "}
														<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</a>
						</li>
					</ul>
				</div>{" "}
				<section className='text-center py-12 bg-tealSoft bg-opacity-40 p-4 sm:p-6 md:p-8 fade-in'>
					<p className='text-lg md:text-xl max-w-5xl mx-auto leading-relaxed font-[500] mb-4'>
						<h2 className='text-3xl md:text-5xl font-extrabold mb-6 tracking-wide text-colorOrange gradient-animate bg-gradient-to-r from-colorOrange to-colorOrangeLight bg-clip-text text-transparent'>
							Selling a Probate, Trust, and Conservatorship Property? <br />
							<span className='text-colorTeal'>
								{" "}
								We Handle It ALL—Fast & Easy.
							</span>
						</h2>
						Whether you&apos;re navigating probate, managing a trust, or dealing
						with conservatorship property, we understand that you’ve got a lot
						on your plate. Let us help you get your property{" "}
						{formatText("++sold++")} quickly and at the best price. Whether you
						need cash fast, or you want to get top dollar with a traditional
						sale, we’ve got you covered.{" "}
						<span className='font-bold text-colorTeal'>Fast. Fair. Done.</span>{" "}
						<h2 className='text-3xl md:text-5xl font-extrabold mb-6 tracking-wide text-colorOrange gradient-animate bg-gradient-to-r from-colorOrange to-colorOrangeLight bg-clip-text text-transparent mt-5'>
							Ready to Get Started? <br />
							<span className='text-colorTeal'>
								Call NOW for Your FREE Consultation.
							</span>
						</h2>
						We’re here to make this process as stress-free as possible during
						what can be a difficult time. <br />
						Call{" "}
						<span className='font-bold text-colorOrange'>
							{" "}
							(833) PROBAID
						</span>{" "}
						or{" "}
						<Link to='/free-consultation' className='text-colorTeal font-bold'>
							fill out the{" "}
							<span className='text-colorOrange underline decoration-4 underline-offset-4 decoration-colorTeal'>
								FORM
							</span>{" "}
							below
						</Link>{" "}
						for a{" "}
						<span className='font-bold text-colorOrange'>
							FREE, no-obligation consultation.{" "}
						</span>
						We’ll answer all your questions, guide you through the entire
						process, and provide the support you need as you navigate this
						challenging journey. Let us help ease the burden.
					</p>{" "}
					<div className='flex flex-col md:flex-row justify-center items-center gap-4 mt-8'>
						<Link to='/contact'>
							<div className='relative group'>
								<div className='relative w-60 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
									<img
										src='/logo_shape.svg'
										alt='Learn more background'
										className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
									/>
									<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
										<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
										Learn More{" "}
										<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
									</span>
								</div>
							</div>
						</Link>
						<Link to='/free-consultation'>
							<div className='relative group'>
								<div className='relative w-60 h-20 flex items-center justify-center font-extrabold text-colorTeal group-hover:text-colorOrange text-2xl uppercase text-center mx-auto transition-all duration-300 group-hover:scale-110'>
									<img
										src='/logo_shape.svg'
										alt='Learn more background'
										className='absolute inset-0 w-full h-full object-contain z-0 pointer-events-none transition-transform duration-300 group-hover:rotate-3'
									/>
									<span className='z-10 translate-y-[0.8rem] flex justify-center items-center gap-2.5'>
										<i className='fas fa-turn-down rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>{" "}
										Form{" "}
										<i className='fas fa-turn-up rotate-90 transition-transform duration-300 group-hover:translate-x-1 mt-1.5 text-colorOrange group-hover:text-colorTeal'></i>
									</span>
								</div>
							</div>
						</Link>
					</div>
				</section>{" "}
				<ThankYou />
			</div>
		</div>
	);
};

export default Home;
