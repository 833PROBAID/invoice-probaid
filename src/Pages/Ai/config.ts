// --- Types ---
export interface QAItem {
	number: number;
	category: string;
	question: string;
	keywords: string[];
	answer: string;
}

export interface CompanyInfo {
	name: string;
	phone: string;
	email: string;
	address: string;
	website: string;
}

// --- Configuration ---
export const config = {
	// NOTE: Ideally, use process.env.API_KEY. Using the provided key for demonstration continuity.
	gemenaiApiKey: "AIzaSyCIy9rxV2SYuG_Tqppfxap1GmNLX3UdK64",
	chatBotInstruction: `You are Eva, a Senior Real Estate Specialist at 833PROBAID.
  
  CRITICAL RESPONSE FORMATTING RULES (ALWAYS FOLLOW THESE):
  - When providing information AND then asking a question, use this exact format:
    [INFO] Your informative response here. [QUESTION] Your specific question here?
  - This allows the system to display them as separate messages for better user experience.
  - Only use these markers when you have both information to share AND a follow-up question.
  - For pure information responses, no markers needed.
  - For pure questions, no markers needed.
  
  CORE IDENTITY:
  - You are a HUMAN expert. Do NOT mention you are an AI.
  - You are professional, warm, and highly competent.
  - Your tone is reassuring and authoritative on Probate, Trust, and Conservatorship matters.
  
  COMMUNICATION STYLE:
  - Keep responses CONCISE but INFORMATIVE (3-4 sentences max).
  - Use professional business English.
  - Provide practical context and next steps when relevant.
  - Handle casual conversation naturally - respond to greetings, small talk, and general questions appropriately.
  - Only ask for additional information when it's genuinely needed to provide specific, actionable guidance.
  - If you can give a helpful general answer without more details, do so.
  - Only ask for clarification on location, timeline, value, or specific circumstances when those factors directly impact the advice you're providing.
  - Don't ask questions just to gather information - ask only when the missing information prevents you from giving proper guidance.
  - For casual conversation (greetings, "how are you", etc.), respond naturally without pushing for business details.
  
  - If you cannot answer, say: "That's a nuanced situation. I recommend speaking with one of our senior advisors at (833) 776-2243."`
};

export const COMPANY_INFO: CompanyInfo = {
	name: "833PROBAID",
	phone: "833-776-2243",
	email: "Info@833PROBAID.com",
	address: "311 N. Robertson Blvd, Suite 444, Beverly Hills, CA 90211",
	website: "www.833PROBAID.com",
};

export const QA_DATA: QAItem[] = [
	{
		number: 1,
		category: "probate",
		question: "What is probate real estate?",
		keywords: [
			"probate",
			"real estate",
			"deceased",
			"estate",
			"court-supervised",
		],
		answer:
			"Probate real estate refers to property that is part of a deceased person's estate and must go through a court-supervised process before being sold or distributed. This legal procedure ensures all debts, taxes, and claims are properly addressed before assets can be transferred to beneficiaries. The process typically involves inventorying assets, paying outstanding obligations, and obtaining court approval for any property sales.",
	},
	{
		number: 2,
		category: "probate",
		question: "Can I sell a house during probate?",
		keywords: ["sell", "house", "during probate", "court approval"],
		answer:
			"Yes, but the sale requires court approval and must follow specific legal procedures outlined in the probate code. The executor or administrator must obtain permission from the probate court before listing or selling any property. This ensures transparency and protects the interests of all heirs and creditors involved in the estate.",
	},
	{
		number: 3,
		category: "probate",
		question: "How long does a probate sale take?",
		keywords: ["how long", "timeline", "duration"],
		answer:
			"Typically 4-6 months from listing to close, but complex cases involving heir disputes can take significantly longer. The timeline depends on factors like estate complexity, court backlog, and whether there are contested claims. Working with experienced probate specialists can help streamline the process and potentially reduce delays.",
	},
	{
		number: 4,
		category: "probate",
		question: "What are the fees?",
		keywords: ["fees", "cost", "payment"],
		answer:
			"Costs include court filing fees, executor fees, attorney fees (statutory in CA), and standard real estate commissions. Additional expenses may arise for appraisals, property maintenance, or dispute resolution. These costs are typically paid from the estate assets before distribution to beneficiaries.",
	},
];
