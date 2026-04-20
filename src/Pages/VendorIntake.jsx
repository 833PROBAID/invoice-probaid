import Seo from "../Components/SEO";
import Navigation from "../Shared/Navigation";
import PageHeader from "../Components/PageHeader";
import IconAndTitle from "../Components/IconAndTitle";
import Form2 from "./Form/Form2";

const VendorIntake = () => {
	const sellingAdvantages = [
		{
			id: 1,
			description: "Active business license and insurance (bonding is a plus)",
		},
		{
			id: 2,
			description:
				"Ability to accept deferred payment through escrow when possible (preferred, not required). If you agree to deferred payment and your service total will exceed $600, please be prepared to upload a completed W-9 form along with your application.",
		},
		{
			id: 3,
			description:
				"Proven track record of professionalism, communication, and ethical service",
		},
		{
			id: 4,
			description:
				"Sensitivity to the unique needs of probate, trust, and conservatorship clients",
		},
	];

	return (
		<div className='page-content'>
			<Seo
				title='Vendor Partnership Opportunities — Work with 833PROBAID™'
				description='Explore partnership opportunities with 833PROBAID™. Join us in delivering exceptional real estate services and resources to our clients.'
				pathname='/vendor-intake'
			/>
			<div className='max-w-7xl mx-auto p-4'>
				<Navigation current='/vendor-intake' />
				<PageHeader
					title='Vendor Partnership Opportunities'
					subText='— Work with 833PROBAID'
					img='/WhatIsProbate.jpg'
				/>
				<div className='max-w-full'>
					<p className='font-bold text-xl mt-5 text-colorOrange'>
						As part of our commitment to excellence, we welcome vendors who meet
						the following preferred standards:
					</p>
					<IconAndTitle array={sellingAdvantages} />
					<p className='text-lg  mt-5 text-colorOrange font-bold mb-7'>
						Vendors who meet these standards are more likely to be referred to
						specialized property cases requiring real estate-related services.
						<br />
						<br />
						However, we consider all qualified vendors based on service quality
						and reliability.
						<br />
						<br />
						If you are interested in joining our trusted vendor network, please
						complete the form below for consideration.
						<br />
						<br />
						Approved vendors are kept on file and contacted as needed for
						assignments that fall within their service areas.
					</p>
				</div>
				<Form2 />
			</div>
			<div className='max-w-full'>
				<Navigation current='/vendor-intake' />
			</div>
		</div>
	);
};

export default VendorIntake;
