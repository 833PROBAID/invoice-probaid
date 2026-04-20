import { Typography } from "@material-tailwind/react";
import Navigation from "../Shared/Navigation";
import Seo from "../Components/SEO";

const ContactUs = () => {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with 833PROBAID for expert guidance on probate real estate. Call (833) PROBAID for a FREE consultation and let us help you navigate the probate process."
        pathname="/contact"
      />
      <div className="max-w-7xl mx-auto p-4 text-colorTeal">
        <Navigation current="/contact" />
        <div className="w-full mb-10">
          <div className="relative">
            <img
              src="/contact.jpg"
              alt="Understanding Probate Sales"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <Typography className="text-center p-4  text-lg">
            <Typography className="text-3xl md:text-5xl font-bold my-5 text-colorOrange">
              Contact Us
            </Typography>
            <div className="font-bold text-2xl text-colorOrange">
              Ready to simplify your Inherited or Managed Real Estate sales
              process?
            </div>{" "}
            <div className="font-bold text-2xl text-colorTeal mt-3">
              Call <span className="text-colorOrange">(833) PROBAID</span> today
              for a <span className="text-colorOrange">FREE</span>,
              no-obligation consultation. Let us guide you through this journey
              with compassion and expertise. Your peace of mind is just a call
              away!
            </div>
          </Typography>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start mt-5 text-xl font-bold">
            <ul className="space-y-4 md:w-1/2">
              <li>
                <a
                  href="tel:8337762243"
                  className="flex items-center hover:text-colorTeal"
                >
                  <i className="fas fa-phone-volume mr-3 text-xl text-colorOrange"></i>
                  <div className="flex flex-col items-end">
                    <div className="text-xl">(833) PROBAID</div>
                    <div className="text-[1.1rem] leading-[0.4rem] tracking-[0.09em] lowercase">
                      7762243
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:Info@833PROBAID.com"
                  className="flex items-center hover:text-colorTeal transition-colors"
                >
                  <i className="fas fa-envelope mr-3 text-xl text-colorOrange"></i>
                  <span className="text-xl">Info@833PROBAID.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://833probaid.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-colorTeal transition-colors"
                >
                  <i className="fas fa-globe mr-3 text-xl text-colorOrange"></i>
                  <span className="text-xl">833PROBAID.com</span>
                </a>
              </li>
            </ul>
            <ul className="space-y-4 md:w-1/2 ">
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-3 text-colorOrange"></i>
                <Typography className="text-xl flex flex-wrap font-bold">
                  <div>311 N. Robertson Blvd,&nbsp;</div>
                  <div>Suite 444,&nbsp;</div>
                  <div>Beverly Hills,&nbsp;</div>
                  <div>CA 90211</div>
                </Typography>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-colorOrange"></i>
                <div>
                  <Typography className="font-bold text-xl">
                    Monday - Saturday
                  </Typography>
                  <Typography className="font-bold text-xl">
                    Business Hours: [7am -7pm]
                  </Typography>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Navigation current="/contact" />
      </div>
    </>
  );
};

export default ContactUs;
