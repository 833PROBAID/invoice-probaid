import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { ref, push, getDatabase } from "firebase/database";
import Navigation from "./Navigation";
import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import { app } from "./firebaseConfig";
import Seo from "../Components/SEO";
import { formatText } from "../Components/IconAndTitle";

const DownloadRequestPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    caseNumber: "",
    county: "",
    attorneyName: "",
    isRepresentative: "",
    propertyAddress: "",
    preferredContact: "",
    message: "",
    isEstateRepresentative: false,
    preferScheduleCall: false,
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const db = getDatabase(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);

    const pdfDownloadLink = "https://example.com/probate-guide.pdf";
    const emailHtmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #00796b;">Your Exclusive Probate & Conservatorship Materials</h2>
        <p>Hi <strong>${formData.firstName} ${formData.lastName}</strong>,</p>
        <p>Thank you for requesting our exclusive materials! We'll verify your information and provide access shortly.</p>
        <p>If applicable, click the link below to download initial resources:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${pdfDownloadLink}" style="padding: 10px 20px; background-color: #00796b; color: #fff; text-decoration: none; border-radius: 4px;">
            Download Materials
          </a>
        </p>
        <p>If you have any questions or need further assistance, feel free to <a href="mailto:Info@833PROBAID.com" style="color: #00796b;">contact us</a> or call us directly at (833) PROBAID — (833) 776-2243.</p>
        <p style="text-align: center; font-size: 12px; color: #999;">© All content, branding, and systems under 833PROBAID™ are trademarked and copyrighted. All rights reserved.</p>
      </div>
    `;

    const emailData = {
      sender: {
        name: "833PROBATE",
        email: "Info@833PROBAID.com",
      },
      to: [
        {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
        },
      ],
      subject: "Your Exclusive Probate & Conservatorship Materials",
      htmlContent: emailHtmlContent,
    };

    try {
      // Save data to Firebase
      const dataRef = ref(db, "downloadRequests");
      await push(dataRef, formData);

      // Send email after saving to Firebase
      /* await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
				headers: {
					"Content-Type": "application/json",
					"api-key":
						"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",
				},
			}); */

      Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Thank you for your request. We'll verify your information and provide access to the materials shortly.",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        caseNumber: "",
        county: "",
        attorneyName: "",
        isRepresentative: "",
        propertyAddress: "",
        preferredContact: "",
        message: "",
        isEstateRepresentative: false,
        preferScheduleCall: false,
      });
      localStorage.setItem("requestSubmitted", "true");
    } catch (error) {
      console.error("Error during submission:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to process your request. Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Seo
        title="Download Probate Materials"
        description="Request access to exclusive probate and conservatorship materials and resources for estate representatives and conservators."
        pathname="/download-request"
      />
      <div className="container mx-auto p-4">
        <Navigation current="/download-request" />
        <PageHeader
          title="Request Materials"
          img="/LegalAndEthicalConsiderations.jpg"
        />

        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden mt-6 transform transition duration-500 hover:shadow-2xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-colorTeal to-[#178e93] text-white p-6 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 animate-fade-in">
              Request My Exclusive Probate & Conservatorship Materials
            </h1>
            <p
              className="text-lg md:text-xl lg:text-2xl animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              These resources were created to help real families currently
              navigating the probate or conservatorship process.
            </p>
          </div>

          {/* Requirements Section */}
          <div className="bg-gray-50/80 backdrop-blur-sm p-6">
            <p
              className="mb-4 text-xl md:text-2xl font-bold text-colorTeal animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              To request access, you must meet the following requirements:
            </p>
            <ul className="space-y-4 mb-5">
              <li
                className="flex items-baseline gap-3 animate-slide-in-right"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="text-lg md:text-xl font-medium">
                  You are a court-appointed executor, administrator, or
                  conservator of an estate
                </span>
              </li>
              <li
                className="flex items-baseline gap-3 animate-slide-in-right"
                style={{ animationDelay: "0.4s" }}
              >
                <span className="text-lg md:text-xl font-medium">
                  You have an open probate or conservatorship case in California
                </span>
              </li>
              <li
                className="flex items-baseline gap-3 animate-slide-in-right"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-lg md:text-xl font-medium">
                  You are considering or in need of real estate services related
                  to estate or conservatorship property sales
                </span>
              </li>
            </ul>
            <div
              className="bg-colorOrange border-l-4 border-colorOrange text-white rounded-sm p-4 my-4 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <p className="text-lg md:text-xl flex items-start gap-2">
                <span>
                  Materials and exclusive guidance are available for verified
                  estate representatives. Everything I provide is designed to
                  help you fulfill your legal responsibility, whether you're
                  administering an estate or managing a conservatorship. My goal
                  is to get the property {formatText("++sold++")} without
                  unnecessary delays.
                </span>
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 bg-white/70 backdrop-blur-sm">
            <h2
              className="text-xl md:text-2xl font-bold text-colorOrange mb-4 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              Please complete the form below and include your case number and
              current court jurisdiction. Your materials will be delivered upon
              verification and consultation.
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    First & Last Name*
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Phone*
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Case Number*
                  </label>
                  <input
                    type="text"
                    name="caseNumber"
                    value={formData.caseNumber}
                    onChange={handleChange}
                    placeholder="Your Case Number"
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    County Probate or Conservatorship Court*
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    placeholder="County Court"
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Attorney Name (if applicable)
                  </label>
                  <input
                    type="text"
                    name="attorneyName"
                    value={formData.attorneyName}
                    onChange={handleChange}
                    placeholder="Attorney Name"
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Are you the executor, administrator, or conservator?*
                  </label>
                  <select
                    name="isRepresentative"
                    value={formData.isRepresentative}
                    onChange={handleChange}
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  >
                    <option value="">Please select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Property Address*
                  </label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleChange}
                    placeholder="Property Address"
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                    Preferred Contact Method*
                  </label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                    required
                  >
                    <option value="">Please select</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Text">Text</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-base md:text-lg font-bold text-colorTeal mb-1">
                  Additional Information
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any additional details you'd like to share"
                  className="w-full py-3 px-4 text-lg md:text-xl border-2 border-colorOrange rounded focus:outline-none focus:border-colorTeal transition duration-300"
                  rows="4"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="isEstateRepresentative"
                    checked={formData.isEstateRepresentative}
                    onChange={handleCheckboxChange}
                    className="relative form-checkbox mt-1 h-5 w-5 appearance-none text-colorTeal border-2 border-colorOrange rounded transition duration-300 focus:ring-colorTeal focus:ring-offset-0 cursor-pointer checked:bg-colorTeal"
                    required
                  />
                  <label className="ml-2 block text-base md:text-lg text-gray-700">
                    I understand that this material is reserved for estate
                    representatives or conservators with a real estate need.
                  </label>
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="preferScheduleCall"
                    checked={formData.preferScheduleCall}
                    onChange={handleCheckboxChange}
                    className="relative form-checkbox mt-1 h-5 w-5 appearance-none text-colorTeal border-2 border-colorOrange rounded transition duration-300 focus:ring-colorTeal focus:ring-offset-0 cursor-pointer checked:bg-colorTeal"
                  />
                  <label className="ml-2 block text-base md:text-lg text-gray-700">
                    I would prefer to schedule a free call or property
                    consultation and evaluation instead.
                  </label>
                </div>
              </div>
              <button type="submit" disabled={isSending}>
                <div
                  className="relative h-20 flex items-center justify-center font-extrabold text-colorTeal hover:text-colorOrange text-2xl uppercase text-center"
                  style={{
                    width: isSending ? "15rem" : "11rem",
                  }}
                >
                  <img
                    src="/logo_shape.svg"
                    alt="background"
                    className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
                  />
                  <span
                    className={`z-10 ${
                      isSending
                        ? "translate-y-[0.83rem]"
                        : "translate-y-[0.63rem]"
                    }`}
                  >
                    {isSending ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-colorTeal"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Submit
                      </>
                    )}
                  </span>
                </div>
              </button>
            </form>
          </div>

          {/* No Case Number Section */}
          <div className="bg-blue-50/80 backdrop-blur-sm p-6">
            <h3
              className="text-xl md:text-2xl font-bold text-colorTeal mb-3 animate-fade-in"
              style={{ animationDelay: "0.9s" }}
            >
              No Case Number Yet?
            </h3>
            <p
              className="mb-2 text-base md:text-lg animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              If you don't have a case number yet but need help with an
              inherited or court-controlled property, please call me directly at{" "}
              <a
                href="tel:8337762243"
                className="text-colorOrange font-semibold hover:underline transition-colors"
              >
                (833) PROBAID — that's (833) 776-2243
              </a>
              . I'll gladly schedule a visit and walk you through your options.
            </p>
          </div>

          {/* Disclaimer Section */}
          <div className="p-6 bg-gray-50/80 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold text-colorTeal mb-3">
              Disclaimer
            </h3>
            <p className="text-base md:text-lg mb-4">
              Thank you for your interest in my private probate and
              conservatorship real estate materials. These resources were
              created to support families and professionals responsible for real
              estate sales tied to probate or conservatorship cases.
            </p>
            <p className="text-base md:text-lg mb-4">
              To protect the integrity of this information and ensure it reaches
              the right people, access is limited to verified executors,
              administrators, conservators, and attorneys actively working on an
              estate-related real property matter.
            </p>
            <p className="text-base md:text-lg mb-4">
              Everything I provide is proprietary and legally protected. Please
              only request access if you have an active case or plan to consult
              with me regarding estate or conservatorship property sales.
            </p>
            <p className="text-base md:text-lg mb-4">
              Thank you for respecting the integrity of my work and the privacy
              of the families I serve.
            </p>
          </div>

          {/* Intellectual Property Notice */}
          <div className="p-6 bg-gray-100/80 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold text-colorTeal mb-3">
              Intellectual Property Notice
            </h3>
            <p className="text-base md:text-lg mb-3">
              All materials, content, and brand assets associated with
              <span className="text-colorOrange font-semibold">
                {" "}
                833PROBAID<sup>TM</sup>{" "}
              </span>
              are trademarked and copyrighted property of
              <span className="text-colorOrange font-semibold">
                {" "}
                833PROBAID<sup>TM</sup>
              </span>
              , protected under U.S. law. This includes but is not limited to:
            </p>
            <ul className="marker:text-colorTeal list-disc pl-6 text-base md:text-lg mb-4 space-y-1 text-left">
              <li>
                All brochures, guides, flyers, checklists, and written materials
              </li>
              <li>
                The{" "}
                <span className="text-colorOrange font-semibold">
                  833PROBAID<sup>TM</sup>
                </span>{" "}
                name, logo, and domain
              </li>
              <li>
                The toll-free number{" "}
                <span className="text-colorOrange font-semibold">
                  (833) PROBAID
                </span>
              </li>
              <li>The brand's turquoise and teal color palette</li>
              <li>
                My proprietary consultation system and material distribution
                process
              </li>
            </ul>
            <p className="text-base md:text-lg mb-4 text-left">
              These tools were developed exclusively to support estate
              representatives, conservators, and the professionals managing real
              property during probate, conservatorship, and trust cases.
            </p>
            <p className="text-base md:text-lg mb-4 text-left">
              Unauthorized use, duplication, or distribution is strictly
              prohibited and may result in legal action. Access is limited to
              verified parties actively involved in an estate-related property
              matter.
            </p>
          </div>
        </div>
        <Navigation current="/download-request" />
      </div>
    </>
  );
};

export default DownloadRequestPage;
