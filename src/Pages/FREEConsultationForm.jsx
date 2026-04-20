import Seo from "../Components/SEO";
import Navigation from "../Shared/Navigation";
import PageHeader from "../Components/PageHeader";
import Form from "./Form";
import { Typography } from "@material-tailwind/react";

const FREEConsultationForm = () => {
	return (
		<div className='page-content'>
			<Seo
				title='833PROBAID™ Referral Intake'
				description='Court-Aligned Referrals. Attorney-Trusted Follow-Through.'
				pathname='/free-consultation'
			/>
			<div className='max-w-7xl mx-auto p-4'>
				<Navigation current='/free-consultation' />
				<PageHeader
					title='833PROBAID™ Referral Intake'
					subText='— Court-Aligned Referrals. Attorney-Trusted Follow-Through.'
					img='/WhatIsProbate.jpg'
				/>
				<div className='max-w-full'>
					<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
						For Executors, Administrators, Conservators, & Trustees <br />
						—Court-Aligned. Attorney-Trusted. Ready on Day One.
					</Typography>
					<p className='font-bold text-xl my-5 text-colorOrange'>
						Whether you&#39;re referring a client, a family in need, a personal
						representative, or a case under court supervision — this is where
						execution begins. <br />
						<br />
						I take full control of the real estate, protect your name, and
						coordinate the next step directly to shield the case from delays or
						missteps.
						<br />
						<br />
						No guesswork. No dropped handoffs. Just precision, speed, and
						results the court can trust.
						<br />
						<br />
						This isn't just a referral — it's a legal transfer of
						responsibility.
						<br />
						<br />
						<div
							style={{
								lineHeight: "1.5",
							}}
							className='bg-[#FD7702] font-bold text-white px-2 py-1 mb-3 rounded w-max italic uppercase'>
							Submit the form below. I'll take it from here.
						</div>
					</p>
				</div>
				<Form />
			</div>
			<div className='max-w-full'>
				<Navigation current='/free-consultation' />
			</div>
		</div>
	);
};

export default FREEConsultationForm;
