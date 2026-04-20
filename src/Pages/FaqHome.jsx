import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import IconAndTitle from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const FaqHome = () => {
  const ProbateFAQs = [
    {
      id: "01",
      category: "Probate",
      title: "What is probate and why does it matter in real estate?",
      description:
        "Probate is the legal process for managing a deceased person's estate, including the distribution of assets and settlement of debts. In real estate, probate ensures that properties are transferred legally and properly after the owner's death.",
    },
    {
      id: "02",
      category: "Probate",
      title: "How long does the probate process typically take?",
      description:
        "The probate process in California generally takes about 9 months to 2 years. The duration can vary based on the complexity of the estate, state laws, and whether any disputes arise among heirs.",
    },
    {
      id: "03",
      category: "Probate",
      title: "Are probate sales different from traditional real estate sales?",
      description:
        "Yes, probate sales involve properties owned by deceased individuals and are subject to court oversight. This process includes specific legal requirements, such as needing court approval for the sale price.",
    },
    {
      id: "04",
      category: "Probate",
      title:
        "What are the advantages and disadvantages of buying a property through probate?",
      description:
        "Advantages: Buyers may have the opportunity to acquire properties at below-market prices and negotiate flexible terms. Disadvantages: The process may involve longer closing times and uncertainties regarding the property's condition or title issues.",
    },
    {
      id: "05",
      category: "Probate",
      title: "Can I finance a property purchased through probate?",
      description:
        "Yes, financing is typically available for probate properties through traditional mortgage lenders. However, it's important to work with lenders who understand the probate process, as they may have specific requirements.",
    },
    {
      id: "06",
      category: "Probate",
      title: "How does probate affect property taxes on inherited real estate?",
      description:
        "In California, inherited properties may undergo reassessment for property tax purposes. However, certain exclusions, such as those for transfers between parents and children under Proposition 13, may apply.",
    },
    {
      id: "07",
      category: "Probate",
      title:
        "Can I sell a property in probate before the probate process is complete?",
      description:
        "Yes, properties can be --sold-- before the probate process is fully completed. Once the Executor or Administrator obtains the necessary authority—either full or limited—through the court, they can sell the property. This authority can typically be granted within a few weeks of filing for probate, so you don’t have to wait for the entire process to finalize, which may take much longer.",
    },
    {
      id: "08",
      category: "Probate",
      title: "What happens if there are multiple heirs to a probate property?",
      description:
        "If multiple heirs exist, they must agree on the sale terms and how to distribute the proceeds. If disagreements occur, court intervention may be necessary.",
    },
    {
      id: "09",
      category: "Probate",
      title:
        "Are there any tax implications associated with probate property sales?",
      description:
        "Yes, probate property sales may have tax implications, including potential capital gains taxes if the property sells for more than its basis. It's advisable to consult with a tax professional for specific guidance.",
    },
    {
      id: "10",
      category: "Probate",
      title: "How can I determine if a property is subject to probate?",
      description:
        "Properties that are subject to probate are typically owned by deceased individuals. You can identify them through public records, such as probate court filings or notices of estate administration.",
    },
    {
      id: 11,
      category: "Executors, Trustees & Conservators",
      title:
        "What documents do I need before selling the property as an executor, trustee, or conservator?",
      description:
        "If you’re an executor, you’ll need Letters of Administration or Testamentary and a death certificate. If you’re a trustee, bring a copy of the trust, proof you’re the current trustee, and the deed. Conservators will need a court order authorizing the sale. I’ll help you gather exactly what’s needed and coordinate with your attorney.",
    },
    {
      id: 12,
      category: "Executors, Trustees & Conservators",
      title: "Do I need to notify the HOA if I’m managing the estate or trust?",
      description:
        "Yes. The HOA should be informed that the homeowner passed away and that you’re managing the estate, trust, or conservatorship. They’ll let you know about any dues, rules for selling, and access requirements. I can help you notify them and make sure you’re in compliance.",
    },
    {
      id: 13,
      category: "Executors, Trustees & Conservators",
      disclosure: true,
      title:
        "The property isn’t in great shape—do I need to fix it before selling?",
      description:
        "Not necessarily. Many probate, trust, or conservatorship properties are --sold-- as-is. The key is pricing it right and disclosing everything. If you want to increase value with repairs, I can recommend cost-effective vendors. Either way, I’ve --sold-- homes in all conditions.",
    },
    {
      id: 14,
      category: "Executors, Trustees & Conservators",
      title:
        "Do you work directly with my attorney or do I have to handle it all?",
      description:
        "I work hand-in-hand with your attorney, not in place of them. You won’t be left to figure it all out alone—I coordinate every step so you can focus on your role as executor, trustee, or conservator with confidence.",
    },
    {
      id: 15,
      category: "Executors, Trustees & Conservators",
      disclosure: true,
      title: "What do we do with dad’s guns or meds?",
      description:
        "Firearms should be handled with extreme care. If you’re unsure, I can connect you with a licensed firearms removal or storage professional. Expired medications should be disposed of through local pharmacy drop-offs or hazardous waste programs. We can help coordinate both if needed.",
    },
    {
      id: 16,
      category: "Executors, Trustees & Conservators",
      disclosure: true,
      title: "Is the insurance still valid?",
      description:
        "That’s a big one. Many home insurance policies become void once the homeowner dies or the property is vacant for too long. I always recommend you contact the insurance provider and ask about coverage during probate. If needed, I can refer you to brokers who specialize in vacant estate coverage.",
    },
    {
      id: 17,
      category: "Executors, Trustees & Conservators",
      title: "What if someone’s living in the house?",
      description:
        "If it’s a tenant, relative, or squatter, we’ll need to confirm the situation. In some cases, we may need legal help to remove them. If they’re cooperative, we can work around them—but it’s best to clarify their status early. I’ll help guide you on the cleanest path.",
    },
    {
      id: 18,
      category: "Executors, Trustees & Conservators",
      title: "Do we turn off the water and gas?",
      description:
        "If the home’s vacant and not being cleaned or shown yet, yes—shutting off water and gas can prevent leaks and safety issues. But once we start prepping it for market, they may need to be turned back on. I’ll coordinate timing with the clean-up or repair crews.",
    },
    {
      id: 19,
      category: "Executors, Trustees & Conservators",
      title: "What do we do with everything inside the house?",
      description:
        "You have a few options. You can keep what you want, donate items, sell valuables, or schedule a complete estate cleanout. If you’d like, I can bring in a team to sort, remove, donate, or trash everything—whatever makes your life easier.",
    },
    {
      id: 20,
      category: "Executors, Trustees & Conservators",
      title: "Can we sell the house to pay off the estate debts?",
      description:
        "Absolutely. That’s often the cleanest solution. We’ll talk to your attorney to make sure the timing works with probate or trust rules, and once the house is --sold--, the proceeds can go toward debts, taxes, and beneficiary distributions.",
    },
    {
      id: 21,
      category: "Executors, Trustees & Conservators",
      title: "How fast can we sell the property?",
      description:
        "Depends on the authority granted by the court. If it’s full authority under the Independent Administration of Estates Act, you can usually sell without delays. If it’s limited authority, we’ll need court approval. Either way, I’ll guide you through the right steps to avoid mistakes and delays.",
    },
    {
      id: 22,
      category: "Executors, Trustees & Conservators",
      disclosure: true,
      title:
        "We don’t have time to clean or prep the house. Can you handle it?",
      description:
        "100%. I offer full-service coordination—junk removal, cleaning crews, locksmiths, you name it. You give me access, and I’ll take it from there.",
    },
    {
      id: 23,
      category: "Executors, Trustees & Conservators",
      title: "Do we need court approval before selling?",
      description:
        "Only if you have limited authority. If your Letters say full authority, you can move forward without court confirmation. Either way, I’ll coordinate with your attorney to make sure everything’s compliant.",
    },
    {
      id: 24,
      category: "Executors, Trustees & Conservators",
      disclosure: true,
      title: "What if the estate has no money to fix or clean the house?",
      description:
        "That’s common, and there are solutions. I work with vendors who can defer payment until close of escrow. In some cases, we can even advance funds to get things moving.",
    },
    {
      id: 25,
      category: "Executors, Trustees & Conservators",
      title: "What about personal mail and bills still going to the house?",
      description:
        "You should file a USPS change of address so all mail goes to the executor, trustee, or conservator. I also recommend notifying utility companies and banks so they update the account holder and send all statements to the right person while keeping essential services active.",
    },
    {
      id: 26,
      category: "Executors, Trustees & Conservators",
      title:
        "As a conservator, can I sell property on behalf of the incapacitated person?",
      description:
        "Yes, but only with proper court approval. You’ll need a court order authorizing the sale. I can guide you through what’s required and work with your attorney to make sure we stay compliant.",
    },
    {
      id: 27,
      category: "Executors, Trustees & Conservators",
      disclosure: true,
      title:
        "Can you help me with clean-out and securing the property if I’m not local?",
      description:
        "Absolutely. Whether you're an executor, trustee, or conservator managing from a distance, I can handle everything on-site—lock changes, cleanout, trash removal, and vendor coordination.",
    },
    {
      id: 28,
      category: "Executors, Trustees & Conservators",
      title: "What if there are multiple co-trustees or co-conservators?",
      description:
        "All listed parties will typically need to sign listing agreements and sale documents. I can help facilitate communication and make sure everyone is on the same page legally and logistically.",
    },
    {
      id: 29,
      category: "Executors, Trustees & Conservators",
      title:
        "The incapacitated person has belongings inside. What do I do with them?",
      description:
        "You have the responsibility to protect and document the personal property. I can help coordinate item inventory, cleanup, and storage if needed, while ensuring everything is handled respectfully.",
    },
    {
      id: 30,
      category: "Executors, Trustees & Conservators",
      title: "As a trustee or conservator, what’s my liability in the sale?",
      description:
        "As long as you’re acting within your legal authority and in the best interest of the trust or individual, your liability is limited. I always recommend working alongside your attorney—and I’ll help you stay in full compliance throughout the process.",
    },
    {
      id: 31,
      category: "Executors, Trustees & Conservators",
      title: "How quickly can a trustee or conservator sell the home?",
      description:
        "A trustee can usually sell right away if the trust allows it. A conservator will need a court order. I can help move things quickly on the real estate side while your attorney handles the legal side.",
    },
  ];

  // Group FAQs by category
  const groupedFAQs = ProbateFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <>
      <Seo
        title="Frequently Asked Questions"
        description="Find answers to common questions about probate real estate, the probate process, and working with 833PROBAID. Your guide to understanding probate sales."
        pathname="/faqs"
      />
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/faqs" />
        <PageHeader
          title="Frequently Asked Questions"
          subText="— Your Questions Answered"
          img="/faq.jpg"
        />

        <div className="mt-10 mb-12">
          <Typography className="text-3xl md:text-5xl font-bold mb-8 text-colorTeal text-center">
            Frequently Asked Questions
          </Typography>
          <p className="font-bold text-xl text-center max-w-3xl mx-auto mb-16">
            Find answers to common questions about probate real estate, working
            with executors, trustees, and conservators, and how{" "}
            <span className="text-colorOrange font-semibold">
              833PROBAID<sup>TM</sup>
            </span>{" "}
            can assist you through the process.
          </p>

          {Object.keys(groupedFAQs).map((category) => (
            <div key={category} className="mb-16">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-2 border-colorOrange"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-2xl md:text-4xl font-bold text-colorTeal">
                    {category}
                  </span>
                </div>
              </div>

              <IconAndTitle array={groupedFAQs[category]} />
            </div>
          ))}
        </div>

        <Navigation current="/faqs" />
      </div>
    </>
  );
};

export default FaqHome;
