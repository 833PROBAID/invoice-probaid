import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import IconAndTitle from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";
import { Link } from "react-router-dom";

const UnderstandingProbateSalesHome = () => {
	const arr1 = [
		{
			id: 1,
			title: "An Executor",
			description: "Named in the will to carry out the decedent’s wishes.",
		},
		{
			id: 2,
			title: "An Administrator",
			description: "Appointed by the court if no will exists.",
		},
	];
	const arr2 = [
		{
			id: 1,
			title: "Validation of the Will",
			description:
				"The court authenticates the will to confirm it’s legitimate.",
		},
		{
			id: 2,
			title: "Granting Authority",
			description:
				"The court issues Letters Testamentary or Administration, empowering the executor or administrator.",
		},
		{
			id: 3,
			title: "Overseeing Disputes",
			description:
				"Will contests, creditor claims, and disputes among heirs are handled under court supervision.",
		},
		{
			id: 4,
			title: "Confirming Sales (if necessary)",
			description:
				"Some probate sales, especially those under “Limited Authority,” require a judge’s approval before closing.",
		},
	];

	const steps = [
		{
			id: 1,
			title: "OPENING PROBATE—INITIATING THE PROCESS.",
			description:
				"The first step is filing a petition with the probate court to open the estate. If there’s a will, it’s presented for validation. If not, the court assigns an administrator.",
			text: [
				"Letters are issued to grant legal authority.",
				"Notice is sent to heirs and creditors to inform them of the proceedings.",
			],
		},
		{
			id: 2,
			title: "IDENTIFYING AND INVENTORYING THE ESTATE—LOCKING IN THE ASSETS.",
			description:
				"The personal representative locates and values all estate assets, including :",
			text: [
				"Real estate properties",
				"Bank accounts and investments",
				"Vehicles and personal property",
				"Business interests",
			],
			footer:
				"An official inventory is submitted to the court, complete and verified.",
		},
		{
			id: 3,
			title: "NOTIFYING CREDITORS—SQUARING UP DEBTS.",
			description: "Creditors are notified to make claims against the estate.",
			text: [
				"Public notices are published as required by law.",
				"Direct notifications are sent to known creditors.",
				"Creditors have a specific timeframe to submit claims—miss it, and they lose their right.",
			],
		},
		{
			id: 4,
			title: "PAYING DEBTS AND TAXES—CLEARING THE BALANCE SHEET.",
			description:
				"Before any assets are distributed, debts and taxes must be cleared.",
			text: [
				"Valid claims are paid.",
				"Final income taxes and estate taxes (if applicable) are settled.",
				"Any disputes are handled in court—this is where the process can stall if not managed correctly.",
			],
		},
		{
			id: 5,
			title: "SECURING AND MAINTAINING THE PROPERTY—PRESERVING VALUE.",
			description:
				"While probate is in progress, any real estate must be protected and maintained.",
			text: [
				"Insurance is confirmed.",
				"Utilities are kept running.",
				"The property is safeguarded from vandalism, neglect, and code violations.",
			],
			footer:
				"If the property falls into disrepair, it affects value, meaning less for heirs and a longer sale process.",
		},
		{
			id: 6,
			title: "SELLING THE PROPERTY—MOVING ASSETS WITH PRECISION.",
			description:
				"If real estate needs to be liquidated, it’s listed for sale.",
			text: [
				"Full Authority allows the personal representative to sell without court approval.",
				"Limited Authority requires court confirmation and may involve public bidding.",
				"NOPA Verification – I ensure that a Notice of Proposed Action (NOPA) is sent out if required. This allows beneficiaries 15 days to object. If no objections are raised, the sale moves forward smoothly.",
			],
		},
		{
			id: 7,
			title: "UNDERSTANDING THE OVERBID PROCESS—CALIFORNIA REQUIREMENTS.",
			description:
				"In California, probate property sales under court confirmation are subject to an Overbid Process.",
			nested: [
				{
					title: "The minimum overbid is calculated as follows :",
					text: [
						"10% of the first $10,000 of the accepted offer",
						"5% of the remaining balance of the accepted offer",
					],
				},
				{
					title: "Example Calculation :",
					text: [
						"Accepted Offer: $500,000",
						"10% of the first $10,000 = $1,000",
						"5% of the remaining $490,000 = $24,500",
						"Minimum Overbid Required: $525,500",
					],
				},
				{
					title: "KEY REQUIREMENTS :",
					text: [
						"Overbidders must appear at the confirmation hearing with a cashier's check for 10% of their overbid amount.",
						"All bids are conducted openly in court, ensuring transparency and competitive fairness.",
						"The accepted offer must meet at least 90% of the Probate Referee's appraised value for the sale to be confirmed by the court. If it does not, the sale will not be approved.",
					],
				},
			],
		},
		{
			id: 8,
			title: "DISTRIBUTING THE REMAINING ASSETS—CLOSING THE LOOP.",
			description:
				"Once debts are paid and property is --sold--, the remaining assets are distributed according to the will or state law.",
			text: [
				"Heirs receive their shares.",
				"The court oversees the final accounting to ensure compliance.",
			],
		},
		{
			id: 9,
			title: "CLOSING THE ESTATE—FINALIZING THE LEGACY.",
			description:
				"The personal representative submits a final report to the court, showing all transactions, distributions, and actions taken.",
			text: [
				"The court reviews it.",
				"If approved, the judge signs off and closes the estate.",
				"Legal authority ends, and the estate is considered settled.",
			],
		},
	];

	return (
		<>
			<Seo
				title='Understanding Probate Sales—The Clear Path to Protecting the Estate'
				description='Learn about the probate process, the role of estate agents, and the documentation required for probate sales. Get expert guidance on probate real estate from 833PROBAID.'
				pathname='/understanding-Probate-sales'
			/>
			<div className='max-w-7xl mx-auto p-4'>
				<Navigation current='/understanding-Probate-sales' />
				<PageHeader
					title='Understanding Probate Real Estate Sales'
					subText='—The Clear Path to Protecting the Estate'
					img='/UnderstandingProbateSales.jpg'
				/>

				<p className='font-bold text-xl text-colorOrange my-4'>
					When you’re handling the sale of a probate property, it’s not just
					another transaction—it’s a responsibility. The stakes are high, the
					timelines are critical, and the paperwork is unforgiving. You don’t
					need a generalist—you need a probate specialist who understands every
					twist and turn of the process.{" "}
					<b className='text-colorTeal'>That’s where I come in.</b>
					<br />
					<br />
					I’ve made it my mission to transform what is often seen as a burden
					into a seamless, efficient process that maximizes value and minimizes
					stress.
				</p>
				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					WHAT IS PROBATE?
				</Typography>
				<p className='font-bold text-xl text-colorOrange my-4'>
					Probate is the legal process of settling a deceased person’s estate.
					When someone passes away, their assets—real estate, bank accounts,
					investments—don’t just transfer to heirs automatically. The court
					steps in to ensure debts are paid, legal obligations are fulfilled,
					and the remaining assets are distributed according to the will or
					state law if no will exists. <br /> <br />
					For many families, probate is more than just paperwork. It’s a
					reminder of loss, a process that unearths memories and sometimes,
					unresolved conflicts. I understand that this isn’t just about
					property; it’s about legacy. It’s about making sure what’s left behind
					is handled with care and precision.
				</p>
				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					WHO MANAGES THE PROCESS?
				</Typography>
				<Typography className='font-bold text-xl text-colorOrange my-4'>
					The court appoints a personal representative to take control. This
					person is either:
				</Typography>
				<IconAndTitle array={arr1} />
				<p className='font-bold text-xl text-colorOrange my-4'>
					The personal representative is granted{" "}
					<b className='text-colorTeal'>Letters Testamentary</b> (if there is a
					will) or <b className='text-colorTeal'>Letters of Administration</b>{" "}
					(if there is not). This legal document gives them the authority to act
					on behalf of the estate. Without it, nothing moves.
				</p>
				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					THE ROLE OF THE COURT—GUARDIAN OF THE PROCESS
				</Typography>
				<p className='font-bold text-xl text-colorOrange my-4'>
					The court isn’t just a formality—it’s the ultimate gatekeeper. Nothing
					moves without its approval. Every major action in probate is tracked,
					documented, and scrutinized under a judge’s watchful eye.
				</p>
				<IconAndTitle array={arr2} />
				<img
					src='/WhatIsProbate.jpg'
					alt='Probate'
					className='w-full mt-5 rounded-lg shadow-lg border-2 border-colorOrange'
				/>

				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					THE PROBATE PROCESS—STEP BY STEP
				</Typography>
				<p className='font-bold text-xl text-colorOrange mt-5 -mb-5'>
					This is how the process unfolds from start to finish.
				</p>
				<IconAndTitle array={steps} />
				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					UNDERSTANDING PROBATE IS POWER. EXECUTING IT IS PRECISION.
				</Typography>
				<p className='font-bold text-xl text-colorOrange my-4'>
					You now understand the steps, the players, and the role of the court.
					But understanding is just the beginning. Execution is what separates
					the average from the expert.
				</p>
				<p className='font-bold text-xl text-colorOrange my-4 sm:-mr-9'>
					<Link
						to='/streamlining-probate-real-estate-sales'
						className='text-colorTeal'>
						Next Step :
					</Link>{" "}
					<span>See How I Execute Probate Real Estate with Precision</span>
					<i className='fa-solid fas fa-turn-up rotate-90 text-2xl text-colorOrange mx-3'></i>
					<Link
						to='/streamlining-probate-real-estate-sales'
						className='text-colorTeal'>
						Streamlining Probate Real Estate Sales with Power and Control
					</Link>
					<i className='fa-solid fas fa-turn-up rotate-90 text-2xl text-colorOrange ml-2'></i>
				</p>
				<Navigation current='/understanding-Probate-sales' />
			</div>
		</>
	);
};

export default UnderstandingProbateSalesHome;
