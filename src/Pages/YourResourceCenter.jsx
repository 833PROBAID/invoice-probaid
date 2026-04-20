import PageHeader from "../Components/PageHeader";
import { Typography } from "@material-tailwind/react";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";
import { useEffect, useState } from "react";

const YourResourceCenter = () => {
  const [showRedirectWarning, setShowRedirectWarning] = useState(false);
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get("key");

    if (key === "sold") {
      setShowRedirectWarning(true);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.open("/Seller Guide.pdf", "_blank");
            setShowRedirectWarning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);
  return (
    <>
      <Seo
        title="Your Resource Center — Trusted Guides & Professional Materials to Move Forward With Confidence"
        description="Explore the pros and cons of selling versus keeping probate property. Make informed decisions about inherited real estate with expert guidance."
        pathname="/your-resource-center"
      />
      {showRedirectWarning && (
        <div className="fixed bottom-4 left-4 right-4 bg-white border-l-4 border-colorTeal p-4 rounded-lg shadow-lg max-w-md mx-auto z-[99999]">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-file-download text-colorTeal text-xl"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-colorOrange font-medium">
                Redirecting to Seller's Guide in {countdown} seconds...
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-4">
        <Navigation current="/your-resource-center" />
        <PageHeader
          title="Your Resource Center "
          subText="— Trusted Guides & Professional Materials"
          img="/WhatIsProbate.jpg"
        />{" "}
        <Typography className="text-3xl md:text-5xl font-bold mt-5 text-colorTeal">
          Welcome to the 833POBAID™ Resource Center.
        </Typography>
        <p className="font-bold text-xl mt-5 text-colorOrange leading-7">
          Here, you’ll find trusted tools designed to make your next move
          smarter and smoother. <br />
          <br />
          Feel free to download my Buyer’s and Seller’s Guides, the same
          professional resources my clients rely on to navigate the real estate
          process with clarity and confidence.
        </p>
        <p className="font-bold text-xl mt-5 text-colorOrange leading-7">
          At 833PROBAID™, my mission is simple: deliver results, remove
          confusion, and give you an advantage at every step of your real estate
          journey. <br />
          <br />
          Buying or selling a home isn’t just a transaction, it’s a life
          decision with real stakes. <br />
          <br />
          That’s why I’ve created these professional guides, trusted by my
          clients, to help you move forward with clarity, confidence, and
          real-world strategy. Inside, you’ll find the same standards, systems,
          and mindset that I bring to every deal. <br />
          <br />
          Whether you are preparing to sell or planning to buy, these guides
          will show you exactly what it takes to get it done right.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mt-9">
          {/* Seller's Guide Card */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full max-w-md mx-auto lg:max-w-none flex flex-col items-center">
            <div className="relative overflow-hidden p-6">
              {/* bordered wrapper around the photo only */}
              <div className="inline-block mx-auto rounded-2xl border-4 border-colorTeal overflow-hidden relative">
                <img
                  src="/Seller Guide.png"
                  alt="Seller's Guide Cover"
                  className="block h-auto max-h-[500px] object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            <div className="p-4 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-colorTeal mb-4 text-center">
                Seller's Guide
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg text-center">
                How we position your property for faster sales, stronger offers,
                and maximum value.
              </p>
              <button
                onClick={() => window.open("/Seller Guide.pdf", "_blank")}
                className="w-full bg-gradient-to-r from-colorTeal to-colorTeal/80 hover:from-colorOrange hover:to-colorOrange/80 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <i className="fas fa-download mr-2"></i>
                View Seller's Guide
              </button>
            </div>
          </div>

          {/* Buyer's Guide Card */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full max-w-md mx-auto lg:max-w-none flex flex-col items-center">
            <div className="relative overflow-hidden p-6">
              {/* bordered wrapper around the photo only */}
              <div className="inline-block mx-auto rounded-2xl border-4 border-colorTeal overflow-hidden relative">
                <img
                  src="/Buyer Guide.png"
                  alt="Buyer's Guide Cover"
                  className="block h-auto max-h-[500px] object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            <div className="p-4 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-colorTeal mb-4 text-center">
                Buyer's Guide
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg text-center">
                What to expect from the first showing to closing day, and how to
                navigate it with full confidence.
              </p>
              <button
                className="w-full bg-gradient-to-r from-colorTeal to-colorTeal/80 hover:from-colorOrange hover:to-colorOrange/80 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                onClick={() => window.open("/Buyer Guide.pdf", "_blank")}
              >
                <i className="fas fa-download mr-2"></i>
                View Buyer's Guide
              </button>
            </div>
          </div>
        </div>
        <p className="text-lg  mt-5 text-colorOrange font-bold mb-5 text-center">
          Download your <span className="text-colorTeal">FREE</span> guides
          below and see what it’s like to work with a real estate professional
          who treats your goals like his own.
        </p>
        <Navigation current="/your-resource-center" />
      </div>
    </>
  );
};

export default YourResourceCenter;
