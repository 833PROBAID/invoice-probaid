import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import IconAndTitle, { formatText } from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const TrustSale = () => {
  const steps = [
    {
      id: 1,
      title: `Why Do Trustees Sell Real Estate?`,
      description: `Trust property is often --sold-- for several reasons:`,
      content: [
        {
          title: `Equitable Distribution`,
          description: `Converting property to cash allows for fair division among beneficiaries.`,
        },
        {
          title: `Liquidity Needs`,
          description: `The trust may need funds to pay off debts, taxes, or administrative expenses.`,
        },
        {
          title: `Property Burden`,
          description: `The home may require repairs, may be vacant, or may carry financial risk.`,
        },
        {
          title: `Trust Terms Require It`,
          description: `Some trusts instruct the Trustee to sell property after the settlor's death.`,
        },
      ],
      footer: `Each of these reasons ties directly to the Trustee's duty to protect and administer trust assets responsibly.`,
    },
    {
      id: 2,
      title: `What Must Be Verified Before a Trust Sale?`,
      description: `Before listing a property for sale, certain items must be confirmed:`,
      content: [
        {
          title: `Trustee Authority`,
          description: `The person acting must be named as the current Trustee and have powers of sale.`,
        },
        {
          title: `Trust Structure`,
          description: `The trust must be irrevocable if the settlor is deceased or incapacitated.`,
        },
        {
          title: `Title Alignment`,
          description: `The property must be correctly vested in the trust and recorded as such.`,
        },
        {
          title: `Beneficiary Notification (if required)`,
          description: `In some cases, formal or informal notice to beneficiaries helps avoid disputes, delays, or future objections.`,
        },
      ],
      footer: `If these pieces aren't verified up front, the sale could be challenged — even after escrow closes.`,
    },
    {
      id: 3,
      title: `How Is a Trust Sale Different from Probate or Conservatorship?`,
      description: `Trust sales have distinct advantages and responsibilities:`,
      text: [
        `No Court Petition Required`,
        `No Referee Appraisal Mandated`,
        `Trustee Has Power Granted by Trust`,
        `No Letters, Confirmation Hearings, or Blocked Accounts`,
      ],
      footer: `However, this also means there's no court oversight to catch mistakes. Trustees are fully responsible for ensuring compliance, accuracy, and transparency.`,
    },
    {
      id: 4,
      title: `Common Risks in Trust Sales`,
      description: `Trust sales carry specific risks that must be managed:`,
      content: [
        {
          title: `Unverified Authority`,
          description: `Signing documents without proper authority can void the sale.`,
        },
        {
          title: `Beneficiary Disputes`,
          description: `Failing to notify or involve beneficiaries can trigger legal claims.`,
        },
        {
          title: `Incorrect Vesting`,
          description: `If title doesn't match the trust, probate may be required anyway.`,
        },
        {
          title: `Inexperienced Agents`,
          description: `Most agents don't understand trust sales — putting Trustees at risk.`,
        },
      ],
      footer: `Understanding these risks is crucial for a successful trust sale.`,
    },
  ];

  return (
    <>
      <Seo
        title="Understanding Trust Real Estate Sales"
        description="Learn about the trust sale process, the role of trustees, and the documentation required for trust sales. Get expert guidance on trust real estate from 833PROBAID."
        pathname="/trust-sale"
      />
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/trust-sale" />
        <PageHeader
          title="Understanding Trust Real Estate Sales"
          subText="— Clarity, Control, and Court-Free Execution"
          img="/UnderstandingProbateSales.jpg"
        />

        <p className="font-bold text-xl text-colorOrange my-4">
          When a property is held in a trust, the sale process bypasses probate
          — but that doesn’t mean it’s simple. Trust sales are often
          misunderstood by general agents and mishandled by families who assume
          everything is automatic. The reality? Trust sales still require legal
          authority, precise documentation, and strategic planning — especially
          when multiple beneficiaries or complex trust terms are involved.
          <br />
          <br />
          If real estate is involved, the Trustee carries the burden of managing
          that asset in the best interest of the trust. That includes protecting
          its value, complying with fiduciary duties, and overseeing the
          transaction from start to finish.
        </p>

        <Typography className="text-3xl md:text-5xl font-bold mt-5 text-colorTeal">
          What Is a Trust Sale?
        </Typography>
        <p className="font-bold text-xl text-colorOrange my-4">
          A trust sale occurs when real estate owned by a revocable or
          irrevocable trust is {formatText("++sold++")} by the acting Trustee.
          Unlike probate, there’s typically no need for court confirmation —
          unless the trust is contested or unclear — but that doesn’t mean the
          process is informal or risk-free.
          <br />
          <br />
          Trustees owe a legal duty to act in the best interest of the
          beneficiaries. Real estate is often the most valuable asset in the
          trust, so any misstep can lead to delays, disputes, or financial loss.
          That’s why proper documentation, authority verification, and title
          alignment are critical before proceeding with any sale.
        </p>
        <IconAndTitle array={steps} />
        <Typography className="text-3xl md:text-5xl font-bold mt-5 text-colorTeal">
          Bottom Line
        </Typography>
        <p className="font-bold text-xl text-colorOrange my-4">
          Trust sales may not involve the court — but they still involve the
          law.
          <br />
          <br />
          Every action must be rooted in the trust document, properly recorded,
          and executed with care. Trustees are fiduciaries, not homeowners — and
          trust property must be treated accordingly.
        </p>
        <Navigation current="/trust-sale" />
      </div>
    </>
  );
};

export default TrustSale;
