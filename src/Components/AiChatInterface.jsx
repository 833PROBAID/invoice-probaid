import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { GoogleGenAI } from "@google/genai";
import { config } from "../Pages/Ai/config";

const client = new GoogleGenAI({ apiKey: config.gemenaiApiKey });

const createChatSession = () =>
	client.chats.create({
		model: "gemini-2.0-flash",
		config: {
			temperature: 0.4,
			maxOutputTokens: 300,
			systemInstruction: config.chatBotInstruction,
		},
	});

const AiChatInterface = ({ contextData, contextLabel }) => {
	const [messages, setMessages] = useState([]);
	const [question, setQuestion] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const chatEndRef = useRef(null);
	const chatContainerRef = useRef(null);
	const chatSessionRef = useRef(null);

	useEffect(() => {
		chatSessionRef.current = createChatSession();
	}, []);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	const renderContent = useCallback((content) => {
		const sanitized = DOMPurify.sanitize(marked.parse(content) ?? "");
		return (
			<div
				className='prose prose-sm max-w-none text-gray-700'
				dangerouslySetInnerHTML={{ __html: sanitized }}
			/>
		);
	}, []);

	const handleSubmit = async (e, presetQuestion) => {
		e?.preventDefault();
		const userQuestion = presetQuestion || question.trim();
		if (!userQuestion || isTyping) return;

		const userMessage = {
			role: "user",
			content: userQuestion,
			timestamp: new Date().toISOString(),
		};
		setMessages((prev) => [...prev, userMessage]);
		setQuestion("");
		setIsTyping(true);

		try {
			const contextPrefix = contextData
				? `CURRENT_PAGE_CONTEXT (${contextLabel}): ${JSON.stringify(contextData)}\n\n`
				: "";
			const prompt = `${contextPrefix}User Question: "${userQuestion}"\n\nProvide a clear, direct answer using markdown formatting for structure. Reference specific metrics from the context when relevant.`;

			const response = await chatSessionRef.current.sendMessage({
				message: prompt,
			});
			const text =
				response?.text?.trim?.() ||
				"I apologize, I couldn't generate a response at the moment.";

			// Check for AI response markers to split into separate messages
			const fullMatch = text.match(/\[INFO\](.*?)\[QUESTION\](.*)/);
			const questionOnlyMatch = text.match(/^(.*?)\[QUESTION\](.*)/);

			if (fullMatch) {
				// Split response with both INFO and QUESTION markers
				const infoPart = fullMatch[1].trim();
				const questionPart = fullMatch[2].trim();

				// Add info message immediately
				const infoMessage = {
					role: "assistant",
					content: infoPart,
					timestamp: new Date().toISOString(),
				};
				setMessages((prev) => [...prev, infoMessage]);

				// Add question message after delay
				setTimeout(() => {
					const questionMessage = {
						role: "assistant",
						content: questionPart,
						timestamp: new Date().toISOString(),
					};
					setMessages((prev) => [...prev, questionMessage]);
					setIsTyping(false);
				}, 2000);
			} else if (questionOnlyMatch) {
				// Split response with only QUESTION marker
				const infoPart = questionOnlyMatch[1].trim();
				const questionPart = questionOnlyMatch[2].trim();

				// Add info message immediately
				const infoMessage = {
					role: "assistant",
					content: infoPart,
					timestamp: new Date().toISOString(),
				};
				setMessages((prev) => [...prev, infoMessage]);

				// Add question message after delay
				setTimeout(() => {
					const questionMessage = {
						role: "assistant",
						content: questionPart,
						timestamp: new Date().toISOString(),
					};
					setMessages((prev) => [...prev, questionMessage]);
					setIsTyping(false);
				}, 2000);
			} else {
				// Single message without markers
				const assistantMessage = {
					role: "assistant",
					content: text,
					timestamp: new Date().toISOString(),
				};
				setMessages((prev) => [...prev, assistantMessage]);
				setIsTyping(false);
			}
		} catch (error) {
			console.error("Chat error:", error);
			const errorMessage = {
				role: "assistant",
				content:
					"I'm experiencing a connection issue. Please try again in a moment.",
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, errorMessage]);
			setIsTyping(false);
		}
	};

	const suggestedQuestions = [
		"What does my current score mean?",
		"What should I prioritize next?",
		"How can I improve my results?",
		"Explain the key metrics shown",
	];

	return (
		<div className='bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden'>
			<button
				type='button'
				onClick={() => setIsExpanded(!isExpanded)}
				className='w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-full bg-white shadow-md p-0.5'>
						<img
							src='/eva.png'
							alt='Eva'
							className='w-full h-full rounded-full object-cover'
						/>
					</div>
					<div className='text-left'>
						<p className='text-xs uppercase tracking-[0.3em] text-[#0097A7]'>
							AI Advisory Chat
						</p>
						<h3 className='text-lg font-bold text-[#0097A7]'>
							Ask Eva About Your Results
						</h3>
					</div>
				</div>
				<i
					className={`fas fa-chevron-down text-[#0097A7] transition-transform ${
						isExpanded ? "rotate-180" : ""
					}`}></i>
			</button>

			{isExpanded && (
				<div className='border-t border-gray-100'>
					<div 
						ref={chatContainerRef}
						className='h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50'
						style={{ scrollBehavior: 'smooth' }}>
						{messages.length === 0 && (
							<div className='flex flex-col items-center justify-center h-full text-center p-4'>
								<div className='w-16 h-16 rounded-full bg-white shadow-lg mb-3 p-1'>
									<img
										src='/eva.png'
										className='w-full h-full rounded-full object-cover'
										alt='Eva'
									/>
								</div>
								<h2 className='text-lg font-bold text-gray-800 mb-1'>
									Hi, I&apos;m Eva
								</h2>
								<p className='text-xs text-gray-500 mb-4'>
									Ask me anything about your results on this page.
								</p>
								<div className='grid gap-2 w-full'>
									{suggestedQuestions.map((q, i) => (
										<button
											key={i}
											type='button'
											onClick={(e) => handleSubmit(e, q)}
											className='text-left p-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#0097A7] hover:text-[#0097A7] transition-colors'>
											{q}
										</button>
									))}
								</div>
							</div>
						)}

						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex ${
									msg.role === "user" ? "justify-end" : "justify-start"
								}`}>
								<div
									className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
										msg.role === "user"
											? "bg-[#0097A7] text-white rounded-br-none"
											: "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
									}`}>
									{msg.role === "user" ? msg.content : renderContent(msg.content)}
								</div>
							</div>
						))}

						{isTyping && (
							<div className='flex justify-start'>
								<div className='bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm'>
									<div className='flex gap-1'>
										<span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'></span>
										<span
											className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'
											style={{ animationDelay: "0.1s" }}></span>
										<span
											className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'
											style={{ animationDelay: "0.2s" }}></span>
									</div>
								</div>
							</div>
						)}
						<div ref={chatEndRef} />
					</div>

					<div className='p-4 bg-white border-t border-gray-100'>
						<form onSubmit={handleSubmit} className='flex gap-2'>
							<input
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								placeholder='Ask Eva about your results...'
								className='flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 focus:border-[#0097A7] transition-all'
							/>
							<button
								type='submit'
								disabled={!question.trim() || isTyping}
								className={`w-12 rounded-xl flex items-center justify-center transition-all ${
									!question.trim()
										? "bg-gray-100 text-gray-400"
										: "bg-[#0097A7] text-white shadow-md hover:bg-[#007A87]"
								}`}>
								<i className='fas fa-paper-plane'></i>
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

AiChatInterface.propTypes = {
	contextData: PropTypes.object,
	contextLabel: PropTypes.string,
};

export default AiChatInterface;
