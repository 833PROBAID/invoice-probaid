import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import IconAndTitle from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";
import Info from "../Shared/Info";

const ExecutingTrustRealEstateSales = () => {
	const steps = [
		{
			id: 1,
			title: `TRUST AUTHORITY CONFIRMATION — NO GRAY AREAS. NO GUESSING.`,
			description: `I don't touch the property until the Trustee's authority is verified beyond question.`,
			text: [
				`Trust agreement and any amendments reviewed in full`,
				`Certification of Trust cross-referenced with title`,
				`Confirmation of irrevocability if settlor is deceased or incapacitated`,
				`Title vesting confirmed to match trust ownership`,
				`Co-Trustee signature requirements clarified`,
				`Beneficiary notification verified if required by the trust`,
			],
			footer: `I don't move forward on assumption — I move on legal verification.`,
		},
		{
			id: 2,
			title: `STRATEGIC PROPERTY PREP — ZERO WASTE. ZERO LIABILITY.`,
			description: `Trust assets must be protected — not just marketed. I prepare the property as if it's under audit.`,
			text: [
				`Full condition assessment documented with photos and cost-to-cure estimates`,
				`Deferred maintenance addressed through vetted vendors — with optional deferred payment`,
				`Safety compliance confirmed — detectors, hazards, code issues`,
				`Title issues, liens, or occupancy risks flagged and resolved before marketing`,
			],
			footer: `I don't let trust property sit vulnerable — I prepare it for fiduciary-grade presentation.`,
		},
		{
			id: 3,
			title: `TITLE AND ESCROW SYNC — NO MISSING PIECES.`,
			description: `Before the first buyer sees the home, title and escrow are ready for the final act.`,
			text: [
				`Preliminary Title Report reviewed with full legal name and trust match`,
				`Vested owner confirmed under trust entity — not just the Trustee's personal name`,
				`Escrow officer briefed on trust structure and closing requirements`,
				`Seller-side documents drafted and pre-reviewed for accuracy`,
			],
			footer: `No delays. No rejected documents. No confusion at closing.`,
		},
		{
			id: 4,
			title: `LAUNCHING THE LISTING — TRUST SALE DISCLOSED. LEGITIMACY DISPLAYED.`,
			description: `This is not a casual listing. It's a fiduciary-controlled asset. I market accordingly.`,
			text: [
				`MLS and public disclosures explicitly state this is a Trust Sale`,
				`Buyer's agents receive required trust documentation prior to offer`,
				`Marketing focuses on liquidity, certainty, and clean transfer — not fluff or upgrades`,
				`Showings coordinated with full control and transparency for the Trustee`,
			],
			footer: `I don't attract amateurs. I position trust property for serious, qualified buyers only.`,
		},
		{
			id: 5,
			title: `OFFER REVIEW AND SELECTION — COMPLIANT, DOCUMENTED, COURT-DEFENSIBLE.`,
			description: `Every offer is reviewed like it's heading to litigation — because in some cases, it might.`,
			text: [
				`Full offer summaries presented to Trustee with terms, timeline, and net sheet`,
				`Title and escrow officers looped in early to flag vesting or payoff issues`,
				`Beneficiary concerns addressed and documented when applicable`,
				`No acceptance until trust terms, authority, and risk exposure are fully reviewed`,
			],
			footer: `I don't rush to escrow. I protect the estate's position before signatures are made.`,
		},
		{
			id: 6,
			title: `ESCROW MANAGEMENT — TOTAL CONTROL. TOTAL CLARITY.`,
			description: `I oversee escrow from day one like a court auditor is watching.`,
			text: [
				`Trust vesting confirmed on all documents and wire instructions`,
				`Final statement of information and preliminary change of ownership forms pre-filled`,
				`Buyer acknowledgments regarding trust status signed and stored`,
				`Escrow timeline enforced to avoid drift, confusion, or surprise extensions`,
			],
			footer: `I don't babysit escrow. I drive it — on schedule and under legal alignment.`,
		},
		{
			id: 7,
			title: `CLOSING THE SALE — EXECUTED. RECORDED. UNCONTESTED.`,
			description: `When the property closes, it closes clean — no hangovers, no red flags, no backlash.`,
			text: [
				`Final settlement statement delivered to Trustee with complete breakdown`,
				`Proceeds wired to trust account or as directed in the trust instrument`,
				`Recording confirmed with correct vesting and legal description`,
				`Full closing package prepared for Trustee's records, attorney files, and beneficiaries`,
			],
			footer: `I don't "close deals." I close them flawlessly — with records that stand up to any challenge.`,
		},
	];

	return (
		<>
			<Seo
				title='Executing Trust Real Estate Sales with Legacy in Mind'
				description='Learn about the trust sale process, the role of trustees, and the documentation required for trust sales. Get expert guidance on trust real estate from 833PROBAID.'
				pathname='/executing-trust-real-estate-sales'
			/>
			<div className='max-w-7xl mx-auto p-4'>
				<Navigation current='/executing-trust-real-estate-sales' />
				<PageHeader
					title='Executing Trust Real Estate Sales /n with Legacy in Mind'
					subText='— Control the Asset. Protect the Value. Close Without a Courtroom.'
					img='/UnderstandingProbateSales.jpg'
				/>

				<p className='font-bold text-xl text-colorOrange my-4'>
					<div className='font-bold text-colorTeal'>
						Trust sales aren’t casual. They are legal, fiduciary-driven
						transactions — and the margin for error is zero.
					</div>
					<br />
					There’s no court to clean up the mess if a general agent mishandles
					it. That’s why I don’t just “list” trust properties. I verify the
					authority, coordinate legal alignment, and deliver execution that
					protects the Trustee, satisfies the beneficiaries, and withstands
					post-sale scrutiny. Every move I make is backed by documentation,
					transparency, and court-defensible precision.
				</p>

				<IconAndTitle array={steps} />
				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					PRESERVE WHAT MATTERS. EXECUTE WITH CERTAINTY
				</Typography>
				<p className='font-bold text-xl text-colorOrange my-4'>
					Trust property is not a retail product. It’s a legal asset. Every
					misstep exposes the Trustee to liability and opens the door to
					disputes. I eliminate that risk — with verified authority, airtight
					disclosures, and execution that exceeds the legal standard. You’re not
					just listing a home — you’re fulfilling a legal obligation. Let’s do
					it right.
				</p>
				<Typography className='text-3xl md:text-5xl font-bold mt-5 text-colorTeal'>
					HONOR THE LEGACY. LOCK THE FILE
				</Typography>
				<Info />
				<p className='text-colorOrange mt-5 font-bold text-xl'>
					<span className='text-colorTeal'>
						Because in trust real estate, there’s no judge to fix your mistake —
						only lawsuits to prove you made one.
					</span>
				</p>
				<Navigation current='/executing-trust-real-estate-sales' />
			</div>
		</>
	);
};

export default ExecutingTrustRealEstateSales;
