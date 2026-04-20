import IconAndTitle from "../Components/IconAndTitle";
import { Typography } from "@material-tailwind/react";
import PageHeader from "../Components/PageHeader";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const GlossaryOfProbateTermsHome = () => {
  const array = [
    {
      title: "A",
      content: [
        {
          title: "Administrator",
          description:
            "A person or institution appointed by the court (in the absence of a will otherwise naming an Executor) to distribute the assets according to state intestacy laws and to pay creditors and taxes. The intestate Personal Representative.",
        },
        {
          title: "Affidavit",
          description: "A written statement made under oath.",
        },
        {
          title: "Affidavit of Death of Trustee",
          description:
            "A legal document used to formally record the death of a trustee and establish the successor trustee's authority to act. This affidavit is typically required by title and escrow in trust sales when real estate is being --sold-- after the original trustee (often the Trustor) has passed away. It is recorded with the county recorder's office along with a certified copy of the death certificate to clear title and transfer signing authority to the new trustee.",
        },
        {
          title: "Age of Majority",
          description:
            "The age when a person acquires all the rights and responsibilities of being an adult. In most states, the age of majority is 18.",
        },
        {
          title: "Assignment",
          description:
            "The transfer of legal rights from one person to another.",
        },
        {
          title: "Authentication",
          description:
            "The process for verifying that the deceased's last will and testament is valid. The probate court typically relies on witness statements when making its determination.",
        },
      ],
    },
    {
      title: "B",
      content: [
        {
          title: "Beneficiary",
          description:
            "A person who inherits property, money, or other benefits from a will, insurance policy, or trust.",
        },
        {
          title: "Blocked Account",
          description:
            "A court-restricted bank account where funds from a probate, conservatorship, or minor's settlement are deposited. Withdrawals require prior court approval. Often used to protect assets that must remain untouched until further order, distribution, or specific use is authorized.",
        },
        {
          title: "Bond",
          description:
            "A court-mandated posting bond serves as a guarantee that the executor of the deceased's estate will adhere to state laws and the terms of the will or trust.",
        },
      ],
    },
    {
      title: "C",
      content: [
        {
          title: "Capital Gain",
          description:
            "The profit made from the sale of a capital asset, such as real estate, jewelry, or stocks and bonds.",
        },
        {
          title: "Capital Loss",
          description:
            "The loss that results from the sale of a capital asset, such as real estate, jewelry, or stocks and bonds.",
        },
        {
          title: "Chapter 13 Bankruptcy",
          description:
            "A type of bankruptcy in which a person keeps their assets and pays creditors according to an approved plan.",
        },
        {
          title: "Chapter 7 Bankruptcy",
          description:
            "A type of bankruptcy in which a person's assets are liquidated (collected and --sold--) and the proceeds are distributed to the creditors.",
        },
        {
          title: "Codicil",
          description: "An amendment to a will.",
        },
        {
          title: "Common-law Marriage",
          description:
            "In some states, a couple is considered married if they meet certain requirements, such as living together as spouses for a specific length of time. Such a couple has all the rights and obligations of a traditionally married couple.",
        },
        {
          title: "Community Property",
          description:
            "Property acquired by a couple during their marriage. Some states divide everything the couple gains after getting married evenly between them. In the event of divorce or death, the property is split 50-50 with no consideration of which partner paid for the asset or holds it in their name.",
        },
        {
          title: "Conservatee",
          description:
            "The person who is under conservatorship, for whom the court has appointed someone to manage financial or personal affairs.",
        },
        {
          title: "Conservator",
          description:
            "A person or institution a court appoints to protect the interests of an incompetent and act on their behalf as a guardian.",
        },
        {
          title: "Court Confirmation",
          description:
            "A legal process required in some probate cases where a judge must approve the real estate sale.",
        },
        {
          title: "Contingency",
          description:
            "A condition in a purchase agreement that must be satisfied before the sale can be completed, such as securing financing or obtaining satisfactory home inspections.",
        },
        {
          title: "Contract",
          description:
            "An agreement between two or more parties in which an offer is made and accepted, and each party benefits. The agreement can be formal, informal, written, or oral. Some contracts are required to be in writing in order to be enforced.",
        },
        {
          title: "Creditor",
          description: "A person (or institution) to whom money is owed.",
        },
        {
          title: "Creditors' Claims Period",
          description:
            "Specific time frame, as defined by state probate laws, during which creditors can file a claim against a decedent's estate.",
        },
        {
          title: "Custodian",
          description:
            "A person who will dispense and manage funds on behalf of a child. This person is not subject to court supervision or accounting requirements under the Uniform Transfers to Minors Act.",
        },
      ],
    },
    {
      title: "D",
      content: [
        {
          title: "Date of Death",
          description:
            "The specific date and time the deceased is declared legally dead by a physician, coroner, or medical examiner. It can also be the date that an individual disappears under life-threatening circumstances.",
        },
        {
          title: "Debtor",
          description: "A person who owes money.",
        },
        {
          title: "Decedent",
          description: "A person who passed away.",
        },
        {
          title: "Default",
          description:
            "The failure to fulfill a legal obligation, such as neglecting to pay back a loan on schedule.",
        },
        {
          title: "Demand Letter (Payoff Demand)",
          description:
            "A formal request showing how much is owed on a reverse mortgage, required before a property can be --sold-- or refinanced.",
        },
        {
          title: "Deed",
          description:
            "A legal document that transfers ownership of real estate from one party to another.",
        },
        {
          title: "Docket Number",
          description:
            "Number designation assigned to each case filed in a particular court.",
        },
      ],
    },
    {
      title: "E",
      content: [
        {
          title: "Easement",
          description:
            "An agreement that allows one party access to another's property, often used by utilities that must run phone lines or pipes under private property.",
        },
        {
          title: "Elective Share",
          description:
            "A probate law enabling a spouse to inherit a specific portion of the estate after their partner's death regardless of a will.",
        },
        {
          title: "Emancipation",
          description:
            "The point at which a minor becomes independent from their guardians. Emancipation can result from turning 18, proving to be entirely self-supporting, or getting married.",
        },
        {
          title: "Encumbrance",
          description: "Any claim or restriction on a property's title.",
        },
        {
          title: "Escrow",
          description:
            "Money or documents, such as a deed or title, held by a third party until the conditions of an agreement are met. For instance, pending the completion of a real estate transaction, the deed to the property will be held 'in escrow.'",
        },
        {
          title: "Escrow Account",
          description:
            "A secure account managed by a neutral third party (like a title or escrow company) where funds and documents are held until all terms of the transaction are met — most commonly used in real estate sales during probate, trust, or conservatorship.",
        },
        {
          title: "Estate",
          description: "The assets and liabilities left by a decedent.",
        },
        {
          title: "Ex Parte",
          description:
            "Latin for 'by or for one party.' Refers to urgent court requests where only one party is present, usually because immediate relief is needed and waiting for the other side could cause harm or delay.",
        },
        {
          title: "Executor",
          description:
            "A person or institution named in a will and appointed by the court to oversee and manage an estate, including the distribution of assets and satisfaction of creditors and taxes.",
        },
      ],
    },
    {
      title: "F",
      content: [
        {
          title: "Family Limited Partnership",
          description:
            "A legal partnership between members of a family for the management and control of property.",
        },
        {
          title: "Fiduciary Duty",
          description:
            "An obligation to act in the best interest of another party. For instance, a corporation's board member has a fiduciary duty to the shareholders, a trustee has a fiduciary duty to the trust's beneficiaries, and an attorney has a fiduciary duty to a client.",
        },
        {
          title: "Foreclosure",
          description:
            "When a borrower cannot repay a loan and the lender seeks to sell the property.",
        },
      ],
    },
    {
      title: "G",
      content: [
        {
          title: "General Conservatorship",
          description:
            "A broader conservatorship where the court grants full authority to manage the conservatee's financial and/or personal affairs.",
        },
        {
          title: "Grantor",
          description: "The person who sets up a trust.",
        },
        {
          title: "Guardian",
          description:
            "A person appointed by the court to take care of minor children or incompetent adults. Sometimes called a conservator.",
        },
        {
          title: "Guardian Ad Litem",
          description:
            "Latin for 'guardian at law.' The person appointed by the court to look out for the best interests of the child during the course of legal proceedings.",
        },
      ],
    },
    {
      title: "H",
      content: [
        {
          title: "HECM (Home Equity Conversion Mortgage)",
          description:
            "The most common type of reverse mortgage, insured by the federal government.",
        },
        {
          title: "HECM Servicer",
          description:
            "The entity managing the reverse mortgage after origination. Often different from the original lender. Crucial for payoff, extensions, or foreclosure prevention.",
        },
        {
          title: "Heir",
          description: "A person entitled to inherit property of the decedent.",
        },
        {
          title: "HEMS Standard",
          description:
            "Stands for 'Health, Education, Maintenance, and Support.' A standard often written into trusts that limits how funds can be used or distributed to beneficiaries.",
        },
        {
          title: "Holographic Will",
          description: "A handwritten will.",
        },
      ],
    },
    {
      title: "I",
      content: [
        {
          title: "IAEA (Independent Administration of Estates Act)",
          description:
            "A California law that allows executors and administrators to manage most estate matters — including selling real property — without direct court supervision, depending on the level of authority granted. If the court grants Full Authority, they can sell without court confirmation (with proper notice). If Limited Authority is granted, court approval is still required for any sale. IAEA status is listed in the Letters issued by the probate court.",
        },
        {
          title: "Insolvent Estate",
          description:
            "An estate in which the decedent's debts exceed the total value of their assets, making it impossible to pay all creditors in full.",
        },
        {
          title: "Inventory and Appraisal (I&A)",
          description:
            "A required probate filing listing all estate assets and their appraised value, signed by the referee.",
        },
        {
          title: "Intestate",
          description: "Dying without a legal will.",
        },
        {
          title: "Irrevocable Trust",
          description:
            "A trust written during a person's lifetime that does not allow them to modify its contents.",
        },
      ],
    },
    {
      title: "J",
      content: [
        {
          title: "Joint Tenancy",
          description:
            "A type of ownership arrangement in which two or more individuals own an asset together, with rights of survivorship.",
        },
        {
          title: "Judgment",
          description:
            "A decision by a court regarding the rights and obligations of the parties involved in a legal proceeding.",
        },
      ],
    },
    {
      title: "L",
      content: [
        {
          title: "Last Will and Testament",
          description:
            "The legal document that describes how a person wants their property distributed after they die.",
        },
        {
          title: "Letters of Conservatorship of the Estate",
          description:
            "A court-issued document giving the conservator legal authority to manage the conservatee's financial matters—including real estate. This is the document attorneys and title companies will reference to confirm the conservator's power to list, sell, or manage estate property. Without these letters, no sale should proceed.",
        },
        {
          title: "Letters of Conservatorship of the Person",
          description:
            "A court-issued document giving the conservator authority over personal and medical decisions for the conservatee, such as healthcare, living arrangements, and daily needs. This does not grant authority to sell real estate. Only Letters of the Estate permit financial actions.",
        },
        {
          title: "Living Will",
          description:
            "A legal document that describes a person's wishes regarding medical treatment if they become unable to communicate their preferences.",
        },
        {
          title: "Letter of Intent",
          description:
            "A document that explains a person's desires regarding the distribution of their estate. It is not legally binding, but it can help guide the executor of the estate.",
        },
        {
          title: "Letters Testamentary",
          description:
            "A court document that gives the Executor (the person named in the will) the authority to manage and distribute a deceased person's estate.",
        },
        {
          title: "Letters of Administration",
          description:
            "A court document that gives the Administrator (appointed by the court when there is no will) the legal authority to manage and distribute a deceased person's estate.",
        },
        {
          title: "Limited Conservatorship",
          description:
            "A conservatorship for adults with developmental disabilities that grants the conservator limited powers.",
        },
        {
          title: "Lis Pendens",
          description:
            "A legal notice filed with the county that alerts potential buyers or lienholders that a property is subject to pending litigation. Can block or delay a sale.",
        },
      ],
    },
    {
      title: "M",
      content: [
        {
          title: "Marital Deduction",
          description:
            "The portion of a decedent's estate that can be passed to a surviving spouse tax-free.",
        },
        {
          title: "Market Value",
          description:
            "The estimated price at which a property would sell in the current market, based on factors like location, condition, and comparable sales.",
        },
        {
          title: "Minor",
          description: "A person under the age of majority, typically 18.",
        },
        {
          title: "Muniment of Title",
          description:
            "A will that serves as a document to prove a title to property. A court may issue a muniment of title if it finds that a will is valid and that no estate administration is necessary.",
        },
      ],
    },
    {
      title: "N",
      content: [
        {
          title: "Negligence",
          description:
            "A failure to take reasonable care to avoid causing injury or loss to another person.",
        },
        {
          title: "Notice of Proposed Action (NOPA)",
          description:
            "A formal notice sent by a personal representative with full authority under IAEA to notify interested parties (e.g., heirs, beneficiaries) of an intended action — such as selling property — giving them time to object.",
        },
      ],
    },
    {
      title: "O",
      content: [
        {
          title: "Overbid Process",
          description:
            "The court-supervised auction that allows other buyers to make higher offers at the confirmation hearing.",
        },
        {
          title: "Overage",
          description:
            "The remaining balance after all debts, taxes, and expenses have been paid from an estate.",
        },
      ],
    },
    {
      title: "P",
      content: [
        {
          title: "Partition Action",
          description:
            "A court proceeding used to force the sale or division of property when multiple owners (often heirs) cannot agree. Common in inherited properties with family disputes.",
        },
        {
          title: "Per Stirpes",
          description:
            "A method of distributing an estate whereby descendants inherit the share that their deceased parent would have received.",
        },
        {
          title: "Power of Attorney",
          description:
            "A legal document that allows one person to act on behalf of another.",
        },
        {
          title: "Preliminary Title Report",
          description:
            "A document issued by a title company during the listing phase showing ownership, liens, encumbrances, and legal conditions that may affect the property sale.",
        },
        {
          title: "Probate",
          description: "The legal process of distributing a decedent's assets.",
        },
        {
          title: "Probate Court",
          description:
            "A special court that handles matters relating to wills, and estates.",
        },
        {
          title: "Probate Referee",
          description:
            "A court-appointed official in California who provides a valuation of estate assets (especially real estate) for probate cases. Usually conducts a drive-by appraisal unless more details are submitted.",
        },
        {
          title: "Property Condition Disclosure",
          description:
            "A document provided by the seller disclosing known defects, damages, or issues affecting the property's condition.",
        },
        {
          title: "Proof of Death",
          description:
            "A legal document verifying a person's death, such as a death certificate.",
        },
      ],
    },
    {
      title: "Q",
      content: [
        {
          title: "Quasi-Judicial",
          description:
            "An entity that has some judicial attributes, such as the power to make decisions or interpret laws, but is not a formal court.",
        },
      ],
    },
    {
      title: "R",
      content: [
        {
          title: "Residuary Estate",
          description:
            "The part of a decedent's estate that remains after all specific bequests and other expenses have been paid.",
        },
        {
          title: "Reverse Mortgage",
          description:
            "A type of loan available to homeowners 62 and older that allows them to access home equity without selling. The loan becomes due upon death, sale, or permanent move-out. Often triggers urgent timelines in probate and conservatorship sales.",
        },
      ],
    },
    {
      title: "S",
      content: [
        {
          title: "Spousal Privilege",
          description:
            "A legal concept that protects communications between married couples from being disclosed in court.",
        },
        {
          title: "Statute of Limitations",
          description:
            "A law that sets a maximum time period for parties to initiate legal proceedings.",
        },
        {
          title: "Step-Up in Basis",
          description:
            "A tax adjustment that resets the value of inherited property to its market value at the time of the decedent's death — often reducing capital gains taxes when the property is --sold--.",
        },
        {
          title: "Successor Trustee",
          description:
            "A person named in the trust to take over management duties when the original trustee dies, resigns, or becomes incapacitated. The successor trustee has the authority to manage and distribute trust assets according to the trust's terms.",
        },
      ],
    },
    {
      title: "T",
      content: [
        {
          title: "Testamentary Capacity",
          description: "The legal ability of a person to create a valid will.",
        },
        {
          title: "Testamentary Trust",
          description:
            "A trust created by a will that becomes effective upon the death of the testator.",
        },
        {
          title: "Testator",
          description: "A person who creates a will.",
        },
        {
          title: "Title",
          description:
            "The legal right to ownership of a property, typically evidenced by a deed or other legal documents.",
        },
        {
          title: "Title Search",
          description:
            "An examination of public records to determine the legal ownership of a property and identify any encumbrances, liens, or other issues affecting the title.",
        },
        {
          title: "Trigger Letter / Maturity Event Notification",
          description:
            "A notice sent by the reverse mortgage lender informing the estate or borrower that the loan is now due — typically after death, move-out, or default.",
        },
        {
          title: "Trust",
          description:
            "A legal arrangement in which one party holds property for the benefit of another.",
        },
        {
          title: "Trust Administration",
          description:
            "The process of managing and distributing the trust's assets after the settlor dies, including real estate sales, debt payoff, and reporting to beneficiaries.",
        },
        {
          title: "Trust Certification",
          description:
            "A legal summary of the trust's existence, powers, and authority, used to show that a trustee has the legal right to act. Required in trust sales by title and escrow.",
        },
        {
          title: "Trustee",
          description:
            "A person or institution responsible for managing a trust.",
        },
      ],
    },
    {
      title: "U",
      content: [
        {
          title: "Uniform Probate Code",
          description:
            "A set of laws that standardizes probate procedures across different jurisdictions.",
        },
      ],
    },
    {
      title: "V",
      content: [
        {
          title: "Vested",
          description: "A legal right that is secured or guaranteed.",
        },
      ],
    },
    {
      title: "W",
      content: [
        {
          title: "Will",
          description:
            "A legal document that expresses a person's wishes regarding the distribution of their property after death.",
        },
      ],
    },
  ];
  return (
    <>
      <Seo
        title="The 833-PROBAID™ Glossary"
        description="Comprehensive glossary of probate-related terms and definitions. Understanding the language of probate real estate and legal processes."
        pathname="/glossary-of-probate-terms"
      />
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/glossary-of-probate-terms" />
        <PageHeader
          title="The 833-PROBAID™ Glossary"
          subText="—Real Terms. Real Authority. Built for Court-Controlled Real Estate."
          img="/NavigatingTheSalesProcess.jpg"
        />

        <p className="text-colorOrange font-bold text-xl mt-5">
          Welcome to the official 833-PROBAID™ glossary — a practical reference
          for anyone managing real estate under court supervision. Whether
          you're an executor, conservator, trustee, or heir, this glossary
          breaks down the terms that matter most in probate, conservatorship,
          trust administration, and reverse mortgage cases. <br />
          <br />
          Every definition here is built for clarity, execution, and protection
          of the estate. Understanding these terms ensures better communication
          with attorneys, fewer delays in escrow, and smarter decisions when the
          clock is ticking.
          <br />
          <br />
          Dive in. Master the process. This glossary was built for cases like
          yours.
        </p>
        <IconAndTitle array={array} />

        <Navigation current="/glossary-of-probate-terms" />
      </div>
    </>
  );
};

export default GlossaryOfProbateTermsHome;
