import { useCallback, useRef, useState } from "react";
import { GoogleGenAI } from "@google/genai";
import { config } from "../Pages/Ai/config";

const client = new GoogleGenAI({ apiKey: config.gemenaiApiKey });

const createChatSession = () =>
	client.chats.create({
		model: "gemini-2.0-flash",
		config: {
			temperature: 0.35,
			maxOutputTokens: 240,
			systemInstruction: config.chatBotInstruction,
		},
	});

export const useAiInsights = (
	baseInstruction =
		"Produce an executive-ready micro-brief in Markdown: start with **Insight Summary:** followed by exactly three bullet points labeled **Risk Pulse**, **Primary Driver**, and **Decisive Move**. Each bullet should be one tight sentence (max ~20 words) that is specific and actionable. Keep the overall response under 90 words.",
) => {
	const [insight, setInsight] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const requestIdRef = useRef(0);

	const requestInsight = useCallback(
		async (context) => {
			if (!context) return;

			requestIdRef.current += 1;
			const currentId = requestIdRef.current;
			setLoading(true);
			setError(null);

			try {
				const chat = createChatSession();
				const prompt = `${baseInstruction}\n\nCONTEXT:\n${context}\n\nKeep the tone confident, include concrete numbers/dates if present, and avoid generic filler.`;
				const response = await chat.sendMessage({ message: prompt });
				const text = response?.text?.trim?.() || "No additional insight available right now.";

				if (currentId === requestIdRef.current) {
					setInsight(text);
				}
			} catch (err) {
				console.error("AI insight error", err);
				if (currentId === requestIdRef.current) {
					setError("Unable to retrieve AI insight at the moment.");
				}
			} finally {
				if (currentId === requestIdRef.current) {
					setLoading(false);
				}
			}
		},
		[baseInstruction],
	);

	return { insight, loading, error, requestInsight };
};

export default useAiInsights;
