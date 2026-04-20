import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import IconAndTitle from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const NavigatingTheSalesProcessHome = () => {
  const ProbateTimelines = [
    {
      id: 1,
      title: "Initial Consultation and Assessment",
      subtitle:
        "Before anything else, we talk. I meet with you to understand the property, your timeline, and any court requirements or family dynamics that may affect the process.",
      footer:
        "You’ll get a clear picture of the home’s real value, and how to move forward without surprises.",
      text: [
        "Review the condition and market position of the home",
        "Ask about legal authority (Letters, Trust Certification, or Court Orders)",
        "Explain what’s possible, and what’s not, based on current market conditions",
      ],
    },
    {
      id: 2,
      title: "Verifying Authority to Sell",
      subtitle:
        "Before we list, I confirm that you (or your client) have the legal authority to sign and sell. That means :",
      footer:
        "I won’t move forward until the legal side is confirmed, because clean deals start with clean authority.",
      text: [
        "Letters of Administration or Testamentary for probate cases",
        "A valid Trust Certification for trust sales",
        "A court order for conservatorships",
      ],
    },
    {
      id: 3,
      title: "Property Preparation and Marketing",
      subtitle:
        "Once authority is confirmed, I help you prepare the home for sale :",
      footer:
        "The goal is not just to list, but to present the property right, from day one.",
      text: [
        "I coordinate clean-outs, repairs, or vendor work if needed",
        "I work with vendors who often allow payment at close of escrow, so you don’t have to come out of pocket",
        "I handle photography, marketing, and positioning the property correctly to attract real buyers",
      ],
    },
    {
      id: 4,
      title: "Offer Review and Negotiation",
      subtitle: "When offers come in, I :",
      footer:
        "Every step is documented. Everyone stays informed. I keep things calm and clear, even when the emotions run high.",
      text: [
        "Review the terms with you (and your attorney if needed)",
        "Help compare buyer strength, contingencies, and timelines",
        "Communicate clearly with all parties",
        "Negotiate respectfully but firmly to protect the estate’s equity",
      ],
    },
    {
      id: 5,
      title: "Court Approval (If Required)",
      subtitle:
        "If your case has Limited Authority, I’ll help you prepare for court confirmation. That includes :",
      footer:
        "With Full Authority, we can usually skip this step, but I’ll always verify the case type before advising on timeline or marketing.",
      text: [
        "Submitting the accepted offer for court review",
        "Coordinating with your attorney to ensure deadlines are met",
        "Attending court (if needed) to support the sale’s approval",
      ],
    },
    {
      id: 6,
      title: "Preparing for Closing",
      subtitle: "Once we’re in escrow :",
      footer:
        "Nothing is overlooked. This is where most agents fall apart, I don’t.",

      text: [
        "I stay in close contact with title, escrow, and the attorney",
        "I track every contingency (inspection, loan, disclosures)",
        "I review all closing documents alongside the professionals involved",
        "I confirm funds disbursement instructions, and make sure there are no loose ends",
      ],
    },
    {
      id: 7,
      title: "Final Closing and Sale Completion",
      subtitle: "On the day of closing :",
      footer:
        "I stay with you through the final signature and beyond, because my role doesn’t end when escrow closes.",

      text: [
        "I confirm the buyer’s wire has landed",
        "I walk you through what happens next",
        "I help coordinate anything left on your plate (final walk-through, utilities, document filing)",
      ],
    },
    {
      id: 8,
      title: "Post-Sale Follow-Up",
      subtitle: "After closing :",
      footer:
        "This isn’t just another transaction to me.It’s someone’s legacy.It’s your responsibility.And I take that seriously.",

      text: [
        "I provide a complete closing package with all documents",
        "I remain available in case the court or attorney needs anything related to the sale",
        "I ensure nothing was missed, so you can move forward confidently",
      ],
    },
  ];

  return (
    <>
      <Seo
        title="Navigating the Probate Real Estate Sales Process"
        description="Learn about the probate sales process and important steps involved"
        pathname="/navigating-the-sales-process"
      />
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/navigating-the-sales-process" />
        <PageHeader
          title="Navigating the Probate Real Estate Sales Process"
          img="/NavigatingTheSalesProcess.jpg"
        />
        <p className="font-bold text-xl text-colorOrange mt-5">
          When you're responsible for selling a loved one’s home, as an
          executor, trustee, or conservator, it’s more than a transaction. It’s
          personal. It’s emotional. And it has to be done right.
        </p>
        <p className="font-bold text-xl text-colorOrange mt-5">
          Here’s how I help guide the real estate side from start to finish,
          clearly, respectfully, and efficiently.
        </p>
        <IconAndTitle array={ProbateTimelines} />{" "}
        <Typography className="text-3xl md:text-5xl font-bold mt-8 text-colorTeal">
          Why Attorneys and Fiduciaries Work With Me
        </Typography>
        <IconAndTitle
          array={[
            {
              id: 1,
              footer: "That’s what separates me from the rest.",
              text: [
                "I don’t give legal advice.",
                "I don’t overstep my role.",
                "But I do make their job easier by keeping the real estate side clean, organized, and ready.",
                "If there’s a problem, I flag it early.",
                "If there’s a deadline, I meet it.",
                "And if emotions are running high, I stay steady and professional.",
              ],
            },
          ]}
        />
        <Typography className="text-3xl md:text-5xl font-bold mt-8 mb-3 text-colorTeal">
          Your Legacy Handled with Care
        </Typography>
        <p className="font-bold text-xl text-colorOrange">
          I treat every property sale with the same level of care, making sure
          nothing is overlooked and that everything is handled properly. When
          you work with me, it’s more than just a transaction. It’s about
          handling someone’s legacy with respect and precision.
        </p>
        {/* <Typography className='text-3xl md:text-5xl font-bold mt-8 text-colorTeal'>
					Pricing Strategy
				</Typography>
				<IconAndTitle array={pricingStrategy} />
				<Typography className='text-3xl md:text-5xl font-bold mt-8 mb-3 text-colorTeal'>
					Negotiating Offers
				</Typography>
				<p className='font-bold text-xl text-colorOrange'>
					Negotiating with potential buyers is a vital part of the probate sales
					process, demanding thoughtful planning and a strategic approach.
					Providing guidance on handling negotiations empowers sellers to make
					well-informed choices and secure positive results in their property
					sale.
				</p>
				<IconAndTitle array={negotiationStrategies} />
				<div className='mx-auto text-left mt-9 flex flex-col lg:flex-row gap-3'>
					<div className='flex-1 mb-5 md:mb-0'>
						<Typography className='text-3xl md:text-5xl font-bold mb-5 text-colorTeal'>
							Legal Obligations
						</Typography>
						<p className='font-bold text-xl mb-5 text-colorOrange'>
							When selling a property in a probate sale, it's essential to
							comprehend your legal duties and obligations to guarantee a
							seamless and legally compliant transaction. Specific
							responsibilities must be met to safeguard your interests and
							adhere to laws and regulations:
						</p>

						<IconAndTitle array={legalComplianceStrategies} />
						<p className='font-bold text-xl mt-5 text-colorOrange'>
							By fulfilling these obligations and seeking guidance from legal
							and real estate professionals experienced in probate sales, you
							can confidently navigate the process and ensure a successful
							outcome.
						</p>
					</div>
					<div className='flex-1 h-full lg:mt-28'>
						<img
							src='/LegalObligations.jpg'
							alt='Legal Obligations'
							className='w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out md:mt-0 mt-5 hover:scale-105 border-2 border-colorOrange'
						/>
					</div>
				</div>
				<Typography className='text-3xl md:text-5xl font-bold mt-8 text-colorTeal'>
					Preparing for Closing
				</Typography>
				<IconAndTitle array={closingProcessSteps} />
				<Typography className='text-3xl md:text-5xl font-bold mt-8 mb-3 text-colorTeal'>
					Closing the Sale
				</Typography>
				<p className='font-bold text-xl text-colorOrange'>
					Closing the sale is the final step in the probate sales process,
					resulting in the transfer of ownership from the estate to the buyer.
					This phase entails crucial tasks and considerations that sellers
					should keep in mind for a seamless and prosperous transaction:
				</p>
				<IconAndTitle array={closingProcess} /> */}
        <Navigation current="/navigating-the-sales-process" />
      </div>
    </>
  );
};

export default NavigatingTheSalesProcessHome;
