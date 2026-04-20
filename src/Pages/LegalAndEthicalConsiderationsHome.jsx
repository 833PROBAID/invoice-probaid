import { Typography } from "@material-tailwind/react";
import PageHeader from "../Components/PageHeader";
import IconAndTitle from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";
import Info from "../Shared/Info";

const LegalAndEthicalConsiderationsHome = () => {
  const disclosures = [
    {
      id: 1,
      title: "Material Defects",
      description:
        "I document every known issue—roof, mold, water intrusion, foundation shifts, code violations, prior flooding, fire damage, and environmental hazards. Even if the fiduciary never lived in the home.",
    },
    {
      id: 2,
      title: "Legal Triggers",
      description:
        "I flag liens, lawsuits, city fines, easements, or pending compliance actions before the buyer ever steps foot in the door.",
    },
    {
      id: 3,
      title: "Heir Disputes & Emotional Risks",
      description:
        "If there's known friction or emotional attachment to the asset, I structure the disclosures and documentation so the court sees transparency—not favoritism.",
    },
  ];
  const ProbateSales = [
    {
      id: 1,
      title: "Complete Buyer Disclosures",
      description: `I prepare full condition reports, walk-through data, and agent notes—even when
		TDS and SPQ are exempt. Even when formal disclosure forms are waived, known
		issues must still be documented and disclosed. I surface every material fact
		that could impact value, court review, or fiduciary protection—regardless of
		exemptions.`,
    },
    {
      id: 2,
      title: "NOPA or Court Petition Integration",
      description: `I align the sale file with the exact form of court oversight—NOPA, petition
		for sale, minute order, or full confirmation hearing. Every version has a
		plan.`,
    },
    {
      id: 3,
      title: "Appraisal & Valuation Matching",
      description: `I ensure disclosure packages align with referee values, market comps, and
		accepted offer terms— **so the court sees clarity, not conflict.**`,
    },
    {
      id: 4,
      title: "Timeline Tracking",
      description: `I sync all disclosures and updates with court calendars, confirmation dates,
		and objection windows.`,
    },
  ];
  const ProbateTips = [
    { id: 1, title: "They didn’t know about the damage." },
    { id: 2, title: "This wasn’t disclosed before closing." },
    { id: 3, title: "I didn’t agree to that sale price." },
    { id: 4, title: "I wasn’t told what was wrong with the house." },
  ];

  const disclosureChecklist = [
    {
      id: 1,
      title: "Known Condition Summary",
      description:
        "Based on site visit, walkthrough, seller input, and visible signs",
    },
    {
      id: 2,
      title: "Legal Trigger Checklist",
      description:
        "Title issues, open permits, city violations, and court-involved matters. In cities with mandatory pre-sale inspections or compliance escrows, I initiate the request and coordinate the release—so the transaction stays on schedule",
    },
    {
      id: 3,
      title: "Court Notification Calendar",
      description:
        "If confirmation or notice is required, every deadline is tracked in advance",
    },
    {
      id: 4,
      title: "Disclosures in Sync with Authority Type",
      description:
        "Whether you’re Full Authority, Limited Authority, Conservatorship of the Estate, or Trust with successor powers— **the disclosures match the legal structure**",
    },
    {
      id: 5,
      title: "Escrow-Proof Packet",
      description:
        "Everything lined up to pass title, escrow, and judicial oversight without a single delay",
    },
  ];

  return (
    <>
      <Seo
        title="Legal and Ethical Considerations in Probate"
        description="Learn about the legal requirements and ethical considerations in probate real estate. Understand disclosure requirements, court oversight, and best practices."
        pathname="/legal-and-ethical-considerations"
      />
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/legal-and-ethical-considerations" />
        <PageHeader
          title="Legal and Ethical Compliance"
          subText="—Disclosure That Holds Up in Court, Not Just Escrow"
          img="/LegalAndEthicalConsiderations.jpg"
        />
        <p className="text-colorOrange font-bold text-xl mt-5">
          <span className="text-colorTeal">
            This isn’t about checking boxes. It’s about protecting the estate,
            avoiding lawsuits, and closing with zero blowback.
          </span>{" "}
          <br /> <br />
          Probate and conservatorship real estate sales are court-tracked. That
          means every disclosure, every update, every signed page must survive
          legal scrutiny—
          <b className="text-colorTeal">not just make it through escrow.</b> One
          mistake, one skipped detail, and you don’t just delay closing—you risk
          legal objections, fiduciary liability, or full reversal. <br /> <br />
          <span className="text-colorTeal">
            That doesn’t happen when I run the file.
          </span>
        </p>
        <Typography className="text-3xl md:text-5xl font-extrabold mt-5 text-colorTeal">
          DISCLOSURE ISN’T A FORM—IT’S A COURT-TESTED DEFENSE STRATEGY
        </Typography>
        <p className="text-colorOrange font-bold text-xl mt-5">
          Disclosures aren’t optional. They’re ammunition to protect the estate.
          If it affects value, condition, title, or safety—{" "}
          <b className="text-colorTeal">it’s getting disclosed. Period.</b>
        </p>
        <IconAndTitle array={disclosures} />{" "}
        <p className="text-colorOrange font-bold text-xl mt-5">
          If it could be brought up later in court—I surface it now. I protect
          you before the objections ever come.
        </p>
        <div className="flex items-center justify-center gap-2 mt-10">
          <img
            src="/hopuse1.jpg"
            alt="House 1"
            className="w-1/3 rounded-lg shadow-md border-2 border-colorOrange"
          />
          <img
            src="/hopuse2.jpg"
            alt="House 2"
            className="w-1/3 rounded-lg shadow-md border-2 border-colorOrange"
          />
          <img
            src="/hopuse3.jpg"
            alt="House 3"
            className="w-1/3 rounded-lg shadow-md border-2 border-colorOrange"
          />
        </div>{" "}
        <Typography className="text-3xl md:text-5xl font-extrabold mt-7 text-colorTeal">
          COURT OVERSIGHT IS REAL—AND I BUILD FILES THAT SURVIVE IT
        </Typography>
        <p className="text-colorOrange font-bold text-xl mt-5">
          Here’s what I deliver:
        </p>
        <IconAndTitle array={ProbateSales} />{" "}
        <p className="text-colorOrange font-bold text-xl mt-5">
          Everything I do is built to survive a courtroom challenge—not just a
          buyer’s inspection.
        </p>
        <img
          src="/CourtApprovalOversight.jpg"
          alt="Court Approval Oversight"
          className="w-full mt-5 rounded-lg shadow-md"
        />{" "}
        <Typography className="text-3xl md:text-5xl font-extrabold mt-5 text-colorTeal">
          WHEN YOU DISCLOSE LIKE I DO—OBJECTIONS COLLAPSE ON IMPACT
        </Typography>
        <p className="text-colorOrange font-bold text-xl mt-5">
          Heirs can object. Co-conservators can push back. Attorneys can get
          challenged in court. But when the disclosures are structured,
          defensible, and court-aligned—
          <b className="text-colorTeal">none of it sticks.</b>
          <br />
          <br />I prevent:
        </p>
        <IconAndTitle array={ProbateTips} />{" "}
        <p className="text-colorOrange text-xl mt-5 font-bold">
          Because when I run it,{" "}
          <strong className="text-colorTeal">
            everything’s disclosed, timestamped, confirmed, and neutralized.
          </strong>
        </p>
        <Typography className="text-3xl md:text-5xl font-extrabold mt-5 text-colorTeal">
          COMPLIANCE ISN’T AN OPTION—IT’S A BULLETPROOF STRATEGY
        </Typography>
        <p className="text-colorOrange text-xl mt-5 font-bold">
          Here’s what I put in place <b className="text-colorTeal">before</b>{" "}
          any listing goes live:
        </p>
        <IconAndTitle array={disclosureChecklist} />{" "}
        <Typography className="text-3xl md:text-5xl font-extrabold mt-5 text-colorTeal">
          I DON’T JUST SELL—I PROTECT THE CASE FILE
        </Typography>
        <p className="text-colorOrange font-bold text-xl mt-5">
          There is no “oops” in probate or conservatorship real estate.
          <br />
          <br />
          There is no “we forgot to mention” when you’re dealing with
          court-approved transactions.
          <br />
          <br />
          There is only{" "}
          <span className="text-colorTeal">
            flawless documentation, accurate disclosure, and absolute
            protection.
          </span>{" "}
          <br /> <br />
          I’m not here to explain mistakes. I’m here to make sure they don’t
          happen.
        </p>
        <Typography className="text-3xl md:text-5xl font-extrabold mt-5 text-colorTeal">
          ATTORNEYS TRUST ME. JUDGES RESPECT IT. FIDUCIARIES RELY ON IT.
        </Typography>
        <p className="text-colorOrange font-bold text-xl mt-5">
          You won’t find me scrambling to fix a file mid-escrow.
          <br />
          <br />I already anticipated the objections, pre-loaded the
          disclosures, locked in the updates, and protected every party involved{" "}
          <span className="text-colorTeal">
            —before the petition ever went in.
          </span>{" "}
        </p>
        <Typography className="text-3xl md:text-5xl font-extrabold mt-5 text-colorTeal">
          READY TO LIST? I’M READY TO EXECUTE.
        </Typography>
        <Info />
        <p className="text-colorOrange font-bold text-xl mt-5">
          <span className="text-colorTeal">
            Because when court is watching—there’s no such thing as “close
            enough.”
          </span>{" "}
          <br />
          There’s only full compliance or full exposure. I choose domination.
          Every time.
        </p>
        <Navigation current="/legal-and-ethical-considerations" />
      </div>
    </>
  );
};

export default LegalAndEthicalConsiderationsHome;
