import PageHeader from "../Components/PageHeader";
import IconAndTitle from "../Components/IconAndTitle";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const Commitment = () => {
  const commitments = [
    {
      id: 1,
      description:
        "We protect the estate’s value by moving quickly, managing the real estate process strategically, and coordinating closely with attorneys, fiduciaries, and families.",
    },
    {
      id: 2,
      description:
        "We stay fully aligned with court timelines, legal requirements, and fiduciary duties, ensuring the real estate side never holds up the estate’s progress.",
    },
    {
      id: 3,
      description:
        "We communicate clearly, proactively, and professionally with all parties, so you are never left guessing about the next step or facing unnecessary delays.",
    },
    {
      id: 4,
      description:
        "We tailor our approach to fit each situation, whether it involves court oversight, urgent timelines, sensitive family dynamics, or complex title and lender issues.",
    },
    {
      id: 5,
      description:
        "We represent your interests fiercely, negotiating with focus and protecting the equity entrusted to the estate, conservatee, or trust beneficiaries.",
    },
    {
      id: 6,
      description:
        "We are not just listing agents, we are your dedicated real estate partner, committed to delivering results that uphold the trust placed in you and honor the responsibility you carry.",
    },
  ];

  return (
    <>
      <Seo
        title="Why 833PROBAID™ is the Trusted Choice"
        description="Learn about our commitment to helping you with probate real estate"
        pathname="/commitment"
      />
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/commitment" />

        <PageHeader
          title="Why 833PROBAID™ is the Trusted Choice"
          subText="—Your Trusted Partner in Probate, Trust, and Conservatorship Real Estate"
          img="/handshake.png"
        />
        <p className="text-colorOrange font-bold text-xl mt-5">
          At <span className="text-colorTeal">833PROBAID™</span>, we are
          committed to handling probate, conservatorship, and trust real estate
          sales with the highest level of precision, professionalism, and
          respect.
        </p>

        <IconAndTitle array={commitments} />
        <p className="text-colorOrange font-bold text-xl mt-5">
          When you work with <span className="text-colorTeal">833PROBAID™</span>
          , you gain a team that understands the stakes, respects the process,
          and executes with excellence.
          <br />
          <br />
          Call <span className="text-colorTeal">(833) PROBAID</span>, that’s{" "}
          <span className="text-colorTeal">(833) 776-2243</span>, for a private
          consultation.
          <br />
          <br />
          We are ready to protect the equity, meet the deadlines, and deliver
          the results your case deserves.
        </p>
        <Navigation current="/commitment" />
      </div>
    </>
  );
};

export default Commitment;
