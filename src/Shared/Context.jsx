import { createContext, useContext } from "react";
import GetAuth from "./GetAuth";
const DataContext = createContext();

export function useData() {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error(`Context must be used within a DataProvider`);
	}
	return context;
}

export function DataProvider({ children }) {
	const { user, loading, token } = GetAuth();

	const menus = [
		{
			to: "/commitment",
			icon: "fas fa-handshake",
			text: "Our Commitment",
		},
		{
			to: "/understanding-Probate-sales",
			icon: "fas fa-file-alt",
			text: "Understanding Probate Real Estate Sales",
		},
		{
			to: "/streamlining-probate-real-estate-sales",
			icon: "fas fa-stream",
			text: "Streamlining Probate Real Estate Sales",
		},
		{
			to: "/understanding-conservatorship-sales",
			icon: "fas fa-file-signature",
			text: "Understanding Conservatorship Real Estate Sales",
		},
		{
			to: "/streamlining-conservatorship-real-estate-sales",
			icon: "fas fa-stream",
			text: "Commanding Conservatorship Real Estate Sales",
		},

		{
			to: "/trust-sale",
			icon: "fas fa-file-contract",
			text: "Understanding Trust Real Estate Sales",
		},
		{
			to: "/executing-trust-real-estate-sales",
			icon: "fas fa-file-signature",
			text: "Trust Real Estate Sales with Legacy in Mind",
		},
		{
			to: "/reverse-mortgages",
			icon: "fas fa-home rotate-180",
			text: "Reverse Mortgage Crisis Response",
		},
		{
			to: "/probate-decision-making-selling-vs-keeping-property",
			icon: "fas fa-balance-scale-right",
			text: "Deciding Whether to Sell or Keep",
		},
		{
			to: "/legal-and-ethical-considerations",
			icon: "fas fa-balance-scale",
			text: "Legal and Ethical Considerations",
		},
		{
			to: "/glossary-of-probate-terms",
			icon: "fas fa-book",
			text: "Glossary of Probate Terms",
		},

		{
			to: "/faqs",
			icon: "fas fa-question-circle",
			text: "Frequently Asked Questions",
		},
		{
			to: "/testimonials",
			icon: "fas fa-users",
			text: "Client Testimonials",
		},
		{
			to: "/vendor-intake",
			icon: "fas fa-handshake",
			text: "Vendor Intake",
		},
		{
			to: "/your-resource-center",
			icon: "fas fa-book-open",
			text: "Your Resource Center",
		},
		{
			to: "/contact",
			icon: "fas fa-envelope",
			text: "Contact Us",
		},
		{
			to: "/free-consultation",
			icon: "fas fa-comments",
			text: "FREE Consultation",
		},
	];

	return (
		<DataContext.Provider
			value={{
				user,
				loading,
				token,
				menus,
			}}>
			{children}
		</DataContext.Provider>
	);
}
