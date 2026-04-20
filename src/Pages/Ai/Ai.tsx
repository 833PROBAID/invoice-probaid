import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import "regenerator-runtime/runtime";
import DOMPurify from "dompurify";
import { marked } from "marked";
import Fuse from "fuse.js";
import { GoogleGenAI, Chat } from "@google/genai";
import { config, QA_DATA, COMPANY_INFO } from "./config";
import Avatar from "./Components/Avatar";
import Visualizer from "./Components/Visualizer";

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: config.gemenaiApiKey });

const createChatSession = (): Chat => {
	return ai.chats.create({
		model: "gemini-2.5-flash",
		config: {
			temperature: 0.3,
			maxOutputTokens: 250,
			systemInstruction: config.chatBotInstruction,
		},
	});
};

const sendMessageToGemini = async (
	chat: Chat,
	message: string,
	context?: string,
): Promise<string> => {
	try {
		const msgToSend = context
			? `User Question: "${message}"\n\nOFFICIAL_FIRM_POLICY: "${context}"\n\n(Answer naturally as Eva using this policy.)`
			: message;

		const response = await chat.sendMessage({ message: msgToSend });
		return response.text || "I apologize, I didn't quite catch that.";
	} catch (error) {
		console.error("Connection Error:", error);
		return "I'm having a slight connection issue. Please feel free to call our office directly.";
	}
};

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: string;
}

const Ai: React.FC = () => {
	// State
	const [messages, setMessages] = useState<Message[]>([]);
	const [question, setQuestion] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isMinimized, setIsMinimized] = useState(true);
	const [isVoiceMode, setIsVoiceMode] = useState(false);
	const [showTooltip, setShowTooltip] = useState(true);
	const [questionHistory, setQuestionHistory] = useState<string[]>([]);
	const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
	const [awaitingClarification, setAwaitingClarification] = useState(false);

	// Voice State - Consolidated for better organization
	const [voiceState, setVoiceState] = useState({
		isListening: false,
		isSpeaking: false,
		transcript: "",
		interimTranscript: "",
		selectedVoice: null as SpeechSynthesisVoice | null,
		currentAiResponse: "",
		micError: null as string | null,
	});
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	// Refs
	const chatEndRef = useRef<HTMLDivElement>(null);
	const synthRef = useRef<SpeechSynthesis | null>(null);
	const chatSessionRef = useRef<Chat | null>(null);
	const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Fuse Search
	const fuse = useMemo(
		() =>
			new Fuse(QA_DATA, {
				keys: ["question", "keywords", "answer"],
				threshold: 0.4,
				distance: 100,
			}),
		[],
	);

	// Check for similar questions in history
	const findSimilarQuestion = useCallback(
		(currentQuestion: string): string | null => {
			if (questionHistory.length === 0) return null;

			// Normalize current question
			const normalizedCurrent = currentQuestion
				.toLowerCase()
				.replace(/[?!.,]/g, "")
				.trim();

			// Check for exact match first
			const exactMatch = questionHistory.find(
				(q) =>
					q
						.toLowerCase()
						.replace(/[?!.,]/g, "")
						.trim() === normalizedCurrent,
			);
			if (exactMatch) {
				console.log("Exact match found:", exactMatch);
				return exactMatch;
			}

			const questionFuse = new Fuse(questionHistory, {
				threshold: 0.9, // Even more sensitive
				distance: 150, // Allow more distance for matching
			});

			const results = questionFuse.search(currentQuestion);
			console.log("Similarity check for:", currentQuestion);
			console.log("Normalized:", normalizedCurrent);
			console.log("Question history:", questionHistory);
			console.log("Fuse results:", results);

			if (
				results.length > 0 &&
				results[0].score !== undefined &&
				results[0].score < 0.9
			) {
				console.log(
					"Similar question detected:",
					results[0].item,
					"Score:",
					results[0].score,
				);
				return results[0].item;
			}
			return null;
		},
		[questionHistory],
	);

	// Check Mic Permission
	const checkMicPermission = async () => {
		try {
			// Request permission explicitly like ChatGPT does
			await navigator.mediaDevices.getUserMedia({ audio: true });
			return true;
		} catch (e) {
			console.error("Microphone permission denied:", e);
			return false;
		}
	};

	// Initialize Speech Recognition
	useEffect(() => {
		if (typeof window !== "undefined") {
			const SpeechRecognition =
				window.SpeechRecognition || window.webkitSpeechRecognition;
			if (SpeechRecognition) {
				recognitionRef.current = new SpeechRecognition();
				recognitionRef.current.continuous = false;
				recognitionRef.current.interimResults = true;
				recognitionRef.current.lang = "en-US";

				recognitionRef.current.onstart = () => {
					setVoiceState((prev) => ({
						...prev,
						isListening: true,
						micError: null,
					}));
				};

				recognitionRef.current.onresult = (event) => {
					let interimTranscript = "";
					let finalTranscript = "";
					for (let i = event.resultIndex; i < event.results.length; i++) {
						const transcript = event.results[i][0].transcript;
						if (event.results[i].isFinal) {
							finalTranscript += transcript;
						} else {
							interimTranscript += transcript;
						}
					}
					// Show interim results in real-time
					setVoiceState((prev) => ({
						...prev,
						interimTranscript: interimTranscript || finalTranscript,
						transcript: finalTranscript || prev.transcript,
					}));
				};

				recognitionRef.current.onend = () => {
					setVoiceState((prev) => ({ ...prev, isListening: false }));
				};

				recognitionRef.current.onerror = (event) => {
					console.error("Speech recognition error:", event.error);
					setVoiceState((prev) => ({
						...prev,
						micError: event.error,
						isListening: false,
					}));
				};
			}
		}
	}, []);

	// Speech Recognition Functions
	const startListening = () => {
		if (recognitionRef.current && !voiceState.isListening) {
			setVoiceState((prev) => ({
				...prev,
				transcript: "",
				interimTranscript: "",
			}));
			recognitionRef.current.start();
		}
	};

	const stopListening = () => {
		if (recognitionRef.current && voiceState.isListening) {
			recognitionRef.current.stop();
		}
	};

	const browserSupportsSpeechRecognition = !!recognitionRef.current;

	// --- Initialization ---
	useEffect(() => {
		chatSessionRef.current = createChatSession();
		if (typeof window !== "undefined") {
			synthRef.current = window.speechSynthesis;
		}

		const loadVoices = () => {
			if (!synthRef.current) return;
			const voices = synthRef.current.getVoices();
			// Try to find a female, natural sounding voice
			const preferred =
				voices.find(
					(v) =>
						v.name.includes("Google US English") || v.name.includes("Samantha"),
				) || voices[0];
			setVoiceState((prev) => ({ ...prev, selectedVoice: preferred }));
		};

		loadVoices();
		if (window.speechSynthesis) {
			window.speechSynthesis.onvoiceschanged = loadVoices;
		}
	}, []);

	// Auto-scroll
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	// --- Sound Effects ---
	const playSound = (type: "send" | "receive" | "on") => {
		const ctx = new (window.AudioContext ||
			(window as any).webkitAudioContext)();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);

		const now = ctx.currentTime;

		if (type === "send") {
			osc.frequency.setValueAtTime(400, now);
			osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
			gain.gain.setValueAtTime(0.1, now);
			gain.gain.linearRampToValueAtTime(0, now + 0.15);
			osc.start(now);
			osc.stop(now + 0.15);
		} else if (type === "receive") {
			osc.frequency.setValueAtTime(600, now);
			osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
			gain.gain.setValueAtTime(0.1, now);
			gain.gain.linearRampToValueAtTime(0, now + 0.2);
			osc.start(now);
			osc.stop(now + 0.2);
		} else {
			osc.frequency.setValueAtTime(300, now);
			gain.gain.setValueAtTime(0.05, now);
			gain.gain.linearRampToValueAtTime(0, now + 0.1);
			osc.start(now);
			osc.stop(now + 0.1);
		}
	};

	// --- Logic ---

	const speak = useCallback(
		(text: string) => {
			if (!synthRef.current) return;
			synthRef.current.cancel();

			// Clean markdown for speech
			const cleanText = text.replace(/[*#_]/g, "").trim();

			const utterance = new SpeechSynthesisUtterance(cleanText);
			utterance.rate = 1.05;
			utterance.pitch = 1.1;
			if (voiceState.selectedVoice) utterance.voice = voiceState.selectedVoice;

			utterance.onstart = () =>
				setVoiceState((prev) => ({ ...prev, isSpeaking: true }));
			utterance.onend = () => {
				setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
				// Restart listening after speaking if in voice mode
				if (isVoiceMode) {
					setTimeout(() => {
						setVoiceState((prev) => ({
							...prev,
							transcript: "",
							interimTranscript: "",
						}));
						startListening();
					}, 500);
				}
			};
			utterance.onerror = () =>
				setVoiceState((prev) => ({ ...prev, isSpeaking: false }));

			synthRef.current.speak(utterance);
		},
		[voiceState.selectedVoice, isVoiceMode],
	);

	const handleResponse = async (
		inputText: string,
		similarQuestion?: string | null,
		isClarificationResponse: boolean = false,
	) => {
		// Handle clarification response
		let effectiveQuestion = inputText;
		let contextMessage = "";

		if (isClarificationResponse && pendingQuestion) {
			contextMessage = `Previous question: "${pendingQuestion}"\nAdditional information provided: "${inputText}"\n\nContinue gathering comprehensive information step by step. Ask for ONE more specific detail that would help provide thorough guidance, such as location, timeline, value, relationship, documentation, circumstances, or any other relevant factors. Do not provide a complete answer yet - continue the consultation process to gather all necessary context.`;
			effectiveQuestion = pendingQuestion;
			// Don't clear pending question yet - let AI decide if it needs more info
		}

		// Check for similar questions
		let contextPrefix = "";
		if (similarQuestion && !isClarificationResponse) {
			contextPrefix = `I believe you've asked a similar question before. `;
			console.log("Adding similar question context:", contextPrefix);
		}

		// 1. Check Knowledge Base
		const fuseResult = fuse.search(effectiveQuestion);
		const localContext =
			fuseResult.length > 0 ? fuseResult[0].item.answer : null;

		// Declare variables for response splitting (needed in finally block)
		let fullMatch: RegExpMatchArray | null = null;
		let questionOnlyMatch: RegExpMatchArray | null = null;

		// 3. Get AI Response
		try {
			const promptText = contextMessage || effectiveQuestion;
			const answer = await sendMessageToGemini(
				chatSessionRef.current!,
				promptText,
				localContext || undefined,
			);

			// Check if this response is asking for clarification
			const isAskingForClarification =
				/\bcould you\b.*\?|\bplease specify\b|\bcan you tell me\b.*\?|\bwhat is\b.*\?|\bwhich\b.*\?|\bwhere\b.*\?|\bwhen\b.*\?|\bhow\b.*\?/.test(
					answer.toLowerCase(),
				) &&
				!answer.toLowerCase().includes("recommend") &&
				!answer.toLowerCase().includes("senior advisors");

			if (isAskingForClarification) {
				if (!pendingQuestion) {
					// First time asking for clarification
					setPendingQuestion(inputText);
					setAwaitingClarification(true);
					console.log(
						"AI is asking for clarification, storing pending question:",
						inputText,
					);
				} else {
					// Still need more information after previous clarification
					console.log("AI still needs more clarification");
				}
			} else {
				// AI provided a complete answer
				setPendingQuestion(null);
				setAwaitingClarification(false);
				console.log("AI provided complete answer, clearing pending question");
			}

			// Add context prefix if similar question was found
			const finalAnswer = contextPrefix ? contextPrefix + answer : answer;

			// Start voice synthesis immediately in voice mode
			if (isVoiceMode) {
				const cleanAnswer = finalAnswer
					.replace(/\[INFO\]|\[QUESTION\]/g, "")
					.trim();
				speak(cleanAnswer);
			}

			// Show response in real-time (simulate streaming)
			setVoiceState((prev) => ({ ...prev, currentAiResponse: "" }));
			const words = finalAnswer.split(" ");
			let currentText = "";
			for (let i = 0; i < words.length; i++) {
				currentText += (i > 0 ? " " : "") + words[i];
				setVoiceState((prev) => ({ ...prev, currentAiResponse: currentText }));
				await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms delay per word
			}

			// Check for AI response markers to split into separate messages
			fullMatch = finalAnswer.match(/\[INFO\](.*?)\[QUESTION\](.*)/);
			questionOnlyMatch = finalAnswer.match(/^(.*?)\[QUESTION\](.*)/);

			// Clean version for voice synthesis (remove markers)
			const cleanAnswer = finalAnswer
				.replace(/\[INFO\]|\[QUESTION\]/g, "")
				.trim();

			if (fullMatch) {
				// Split response with both INFO and QUESTION markers
				const infoPart = fullMatch[1].trim();
				const questionPart = fullMatch[2].trim();

				// Add info message immediately
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: infoPart,
						timestamp: new Date().toISOString(),
					},
				]);

				// Play sound for first message
				playSound("receive");

				// Keep typing animation during delay
				setTimeout(() => {
					// Add question message
					setMessages((prev) => [
						...prev,
						{
							role: "assistant",
							content: questionPart,
							timestamp: new Date().toISOString(),
						},
					]);

					// Play sound for second message
					playSound("receive");
				}, 3000);

				// Handle voice synthesis for full response
				if (isVoiceMode) {
					// Voice already started above, no need to speak again
				}
			} else if (questionOnlyMatch) {
				// Split response with only QUESTION marker (info before marker)
				const infoPart = questionOnlyMatch[1].trim();
				const questionPart = questionOnlyMatch[2].trim();

				// Add info message immediately
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: infoPart,
						timestamp: new Date().toISOString(),
					},
				]);

				// Play sound for first message
				playSound("receive");

				// Keep typing animation during delay
				setTimeout(() => {
					// Add question message
					setMessages((prev) => [
						...prev,
						{
							role: "assistant",
							content: questionPart,
							timestamp: new Date().toISOString(),
						},
					]);

					// Play sound for second message
					playSound("receive");
				}, 3000);

				// Handle voice synthesis for full response
				if (isVoiceMode) {
					// Voice already started above, no need to speak again
				}
			} else {
				// Single message for responses without markers
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content: finalAnswer.replace(/\[INFO\]|\[QUESTION\]/g, "").trim(),
						timestamp: new Date().toISOString(),
					},
				]);

				// Play sound for single message
				playSound("receive");

				// Handle voice for single message
				if (isVoiceMode) {
					// Voice already started above, no need to speak again
				}
			}
		} catch (e) {
			const err = "I'm having trouble connecting. Please try again.";
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: err,
					timestamp: new Date().toISOString(),
				},
			]);
			setVoiceState((prev) => ({ ...prev, currentAiResponse: "" }));
			if (isVoiceMode) speak(err);
		} finally {
			// Handle typing animation - keep it active for split messages
			const hasSplitResponse = fullMatch || questionOnlyMatch;
			if (!hasSplitResponse) {
				setIsTyping(false);
			} else {
				// For split responses, keep typing until second message is added
				setTimeout(() => {
					setIsTyping(false);
				}, 3000);
			}
		}
	};

	const submitQuestion = async (
		e?: React.FormEvent,
		overrideText?: string,
		preCheckedSimilarQuestion?: string | null,
	) => {
		if (e) e.preventDefault();
		const text = overrideText || question;
		if (!text.trim()) return;

		// Determine if this is a clarification response
		const isClarificationResponse = awaitingClarification;

		// Check for similar questions BEFORE adding to history (if not already checked and not a clarification)
		const similarQuestion =
			preCheckedSimilarQuestion !== undefined
				? preCheckedSimilarQuestion
				: !isClarificationResponse
					? findSimilarQuestion(text.trim())
					: null;

		// Add to question history (skip for clarification responses)
		if (!isClarificationResponse) {
			setQuestionHistory((prev) => [...prev, text.trim()]);
		}

		// Stop listening while processing
		if (voiceState.isListening) stopListening();

		playSound("send");
		setQuestion("");
		setMessages((prev) => [
			...prev,
			{ role: "user", content: text, timestamp: new Date().toISOString() },
		]);
		setIsTyping(true);

		await handleResponse(text, similarQuestion, isClarificationResponse);
	};

	// Voice Silence Detection
	useEffect(() => {
		if (isVoiceMode && voiceState.transcript && !voiceState.isSpeaking) {
			setVoiceState((prev) => ({
				...prev,
				interimTranscript: voiceState.transcript,
			}));

			if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

			// Wait 2.5s of silence before submitting
			silenceTimerRef.current = setTimeout(() => {
				if (voiceState.transcript.trim().length > 2) {
					// Check for similar questions BEFORE adding to history for voice mode too
					const isClarificationResponse = awaitingClarification;
					const similarQuestion = !isClarificationResponse
						? findSimilarQuestion(voiceState.transcript.trim())
						: null;

					if (!isClarificationResponse) {
						setQuestionHistory((prev) => [
							...prev,
							voiceState.transcript.trim(),
						]);
					}
					submitQuestion(undefined, voiceState.transcript, similarQuestion);
				}
			}, 2500);
		}
		return () => {
			if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
		};
	}, [voiceState.transcript, isVoiceMode, voiceState.isSpeaking]);

	// Toggle Voice Mode
	const toggleMode = async () => {
		playSound("on");
		if (isVoiceMode) {
			setIsVoiceMode(false);
			stopListening();
			synthRef.current?.cancel();
			setVoiceState((prev) => ({ ...prev, isSpeaking: false }));
		} else {
			if (!browserSupportsSpeechRecognition) {
				alert("Browser not supported for voice.");
				return;
			}
			const hasPermission = await checkMicPermission();
			if (!hasPermission) {
				alert(
					"Microphone permission is required for voice mode. Please allow microphone access in your browser settings.",
				);
				return;
			}
			setIsVoiceMode(true);
			setIsMinimized(false);
			setVoiceState((prev) => ({
				...prev,
				transcript: "",
				interimTranscript: "",
				micError: null,
			}));
			startListening();
		}
	};

	const renderContent = (content: string) => {
		const sanitized = DOMPurify.sanitize(marked.parse(content) as string);
		return (
			<div
				className='prose prose-sm max-w-none text-gray-700'
				dangerouslySetInnerHTML={{ __html: sanitized }}
			/>
		);
	};

	// --- Render ---
	return (
		<div className='fixed bottom-0 right-0 p-4 sm:p-6 z-50 flex flex-col items-end pointer-events-none'>
			{/* Minimized / Tooltip */}
			<div className='pointer-events-auto flex flex-col items-end'>
				{isMinimized && showTooltip && (
					<div className='relative'>
						{showTooltip && (
							<div className='banner-tooltip animate-fade-in'>
								<div className='banner-header'>
									<div className='flex items-center gap-2'>
										<div className='animated-robot w-10 h-10 rounded-full bg-white/20 flex items-center justify-center blob-animation'>
											<img
												src='/eva.png'
												alt='Eva'
												className='w-10 h-10 rounded-full object-cover border-2 border-white'
											/>
										</div>
										<div>
											<h3 className='font-bold text-lg animate-slide-in-right animate-stagger-1'>
												Hi, I&apos;m Eva
											</h3>
											<p className='text-xs text-white/80 animate-slide-in-right animate-stagger-2'>
												I&apos;m here to help you!
											</p>
										</div>
									</div>
									<button
										className='banner-close hover-scale'
										onClick={(e) => {
											e.stopPropagation();
											setShowTooltip(false);
										}}>
										<i className='fas fa-times text-sm'></i>
									</button>
								</div>
								<div className='banner-tooltip-content'>
									<p className='text-sm text-gray-600 mb-3 animate-fade-in animate-stagger-3'>
										Get instant answers about Probate, Trust, and
										Conservatorship Real Estate sales.
									</p>
									<button
										onClick={() => setIsMinimized(false)}
										className='btn-action w-full py-2 bg-gradient-to-r from-[#1EAAB1] to-[#178e93] text-white rounded-lg font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 animate-bounce-once animate-stagger-4'>
										<i className='fas fa-comments'></i>
										<span>Start Chatting Now</span>
									</button>
								</div>
							</div>
						)}

						<button
							onClick={() => setIsMinimized(false)}
							className='bg-gradient-to-br from-[#0097A7] to-[#178e93] text-white w-16 h-16 rounded-full shadow-2xl relative hover:scale-110 transition-transform'
							aria-label='Open AI Assistant'>
							<div className='relative'>
								<i className='fas fa-comments text-4xl'></i>
								<span className='absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full animate-pulse'></span>
							</div>
						</button>
					</div>
				)}

				{isMinimized ? (
					<button
						onClick={() => {
							setIsMinimized(false);
							playSound("on");
						}}
						className='w-16 h-16 rounded-full bg-primary hover:bg-primaryDark text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 relative group'>
						<i className='fas fa-comment-dots text-2xl'></i>
						<span className='absolute top-0 right-0 w-4 h-4 bg-accent border-2 border-white rounded-full'></span>
					</button>
				) : null}
			</div>

			{/* Main Interface */}
			{!isMinimized && (
				<div
					className={`pointer-events-auto bg-white w-[90vw] sm:w-[400px] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ease-in-out border border-gray-200 ${isVoiceMode ? "h-[600px]" : "h-[600px] max-h-[80vh]"
						}`}>
					{/* Header */}
					<div className='bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden'>
								<img
									src='/eva.png'
									alt='Eva'
									className='w-full h-full object-cover'
								/>
							</div>
							<div>
								<h3 className='font-bold text-gray-800'>Eva</h3>
								<p className='text-[10px] uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1 leading-7'>
									<span
										className={`w-1.5 h-1.5 rounded-full ${awaitingClarification
												? "bg-yellow-500"
												: voiceState.isSpeaking || voiceState.isListening
													? "bg-orange-500"
													: "bg-green-400"
											}`}></span>
									{awaitingClarification
										? "Awaiting Details"
										: isVoiceMode
											? "Voice Active"
											: "Online"}
								</p>
							</div>
						</div>
						<div className='flex gap-2'>
							<button
								onClick={toggleMode}
								className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isVoiceMode
										? "bg-accent text-white"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}>
								<i
									className={`fas ${isVoiceMode ? "fa-keyboard" : "fa-microphone"
										}`}></i>
							</button>
							<button
								onClick={() => setIsMinimized(true)}
								className='w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center'>
								<i className='fas fa-chevron-down'></i>
							</button>
						</div>
					</div>

					{/* Content Area */}
					<div className='flex-1 overflow-hidden relative bg-gray-50'>
						{/* TEXT MODE */}
						{!isVoiceMode && (
							<div className='absolute inset-0 overflow-y-auto p-4 space-y-4 no-scrollbar'>
								{messages.length === 0 && (
									<div className='flex flex-col items-center justify-center h-full text-center p-4 opacity-0 animate-[fadeIn_0.5s_forwards]'>
										<div className='w-16 h-16 rounded-full bg-white shadow-lg mb-3 p-1'>
											<img
												src='/eva.png'
												className='w-full h-full rounded-full object-cover'
												alt='Eva'
											/>
										</div>
										<h2 className='text-lg font-bold text-gray-800 mb-1'>
											Hi, I'm Eva
										</h2>
										<p className='text-xs text-gray-500 mb-4'>
											Ask me about probate real estate sales.
										</p>
										<div className='grid gap-2 w-full'>
											{[
												"What is probate real estate?",
												"How long does probate take?",
												"What are the costs involved?",
												"Can I sell property during probate?",
											].map((q, i) => (
												<button
													key={i}
													onClick={() => submitQuestion(undefined, q)}
													className='text-left p-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-primary hover:text-primary transition-colors'>
													{q}
												</button>
											))}
										</div>
									</div>
								)}

								{messages.map((msg, i) => (
									<div
										key={i}
										className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
											} animate-[slideUp_0.3s_ease-out]`}>
										<div
											className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${msg.role === "user"
													? "bg-primary text-white rounded-br-none"
													: "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
												}`}>
											{msg.role === "user"
												? msg.content
												: renderContent(msg.content)}
										</div>
									</div>
								))}

								{isTyping && (
									<div className='flex justify-start'>
										<div className='bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm'>
											<div className='flex gap-1'>
												<span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce'></span>
												<span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100'></span>
												<span className='w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200'></span>
											</div>
										</div>
									</div>
								)}
								<div ref={chatEndRef} />
							</div>
						)}

						{/* VOICE MODE */}
						{isVoiceMode && (
							<div className='absolute inset-0 bg-white flex flex-col items-center justify-between animate-[fadeIn_0.5s_ease-out]'>
								{/* Visualizer Area */}
								<div className='flex-1 w-full flex flex-col items-center justify-center'>
									{/* The Avatar */}
									<div className='mb-16'>
										<Avatar
											isSpeaking={voiceState.isSpeaking}
											isListening={voiceState.isListening}
											mood={isTyping ? "thinking" : "neutral"}
										/>
									</div>

									{/* Status Text */}
									<div className='text-center h-10 w-full max-w-[80%] overflow-hidden pt-2'>
										{voiceState.currentAiResponse ? (
											<div className='flex flex-col items-center'>
												<p className='text-primary font-bold mb-1'>
													Eva is responding...
												</p>
												<p className='text-gray-700 text-sm italic truncate w-full px-4'>
													"{voiceState.currentAiResponse}"
												</p>
											</div>
										) : isTyping ? (
											<p className='text-primary font-medium animate-pulse'>
												Processing...
											</p>
										) : voiceState.isSpeaking ? (
											<div className='flex flex-col items-center'>
												<p className='text-primary font-bold mb-1'>
													Eva is speaking
												</p>
												<Visualizer isActive={true} />
											</div>
										) : voiceState.isListening ? (
											<div className='flex flex-col items-center'>
												<p className='text-accent font-bold mb-1'>
													Listening...
												</p>
												<p className='text-sm text-gray-500 italic truncate w-full px-4'>
													"{voiceState.interimTranscript || "..."}"
												</p>
											</div>
										) : (
											<p className='text-gray-400 text-sm'>
												{voiceState.micError || "Mic paused"}
											</p>
										)}
									</div>
								</div>

								{/* Controls */}
								<div className='w-full flex justify-center pb-4'>
									{voiceState.isListening || voiceState.isSpeaking ? (
										<button
											onClick={() => {
												stopListening();
												synthRef.current?.cancel();
												setVoiceState((prev) => ({
													...prev,
													isSpeaking: false,
												}));
											}}
											className='w-16 h-16 rounded-full bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-100 flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105'>
											<i className='fas fa-stop text-xl'></i>
										</button>
									) : (
										<button
											onClick={() => {
												playSound("on");
												setVoiceState((prev) => ({
													...prev,
													transcript: "",
													interimTranscript: "",
												}));
												startListening();
											}}
											className='w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center transition-all shadow-lg hover:shadow-primary/30 hover:scale-110 active:scale-95'>
											<i className='fas fa-microphone text-3xl'></i>
										</button>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Footer Input (Text Mode Only) */}
					{!isVoiceMode && (
						<div className='p-4 bg-white border-t border-gray-100'>
							<form onSubmit={(e) => submitQuestion(e)} className='flex gap-2'>
								<input
									value={question}
									onChange={(e) => setQuestion(e.target.value)}
									placeholder='Type your question...'
									className='flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
								/>
								<button
									type='submit'
									disabled={!question.trim() || isTyping}
									className={`w-12 rounded-xl flex items-center justify-center transition-all ${!question.trim()
											? "bg-gray-100 text-gray-400"
											: "bg-primary text-white shadow-md hover:bg-primaryDark"
										}`}>
									<i className='fas fa-paper-plane'></i>
								</button>
							</form>
							<div className='flex justify-center gap-6 mt-3'>
								<a
									href={`tel:${COMPANY_INFO.phone}`}
									className='text-[10px] font-bold text-gray-400 uppercase tracking-wide hover:text-primary transition-colors flex items-center gap-1'>
									<i className='fas fa-phone'></i> Call
								</a>
								<a
									href={`mailto:${COMPANY_INFO.email}`}
									className='text-[10px] font-bold text-gray-400 uppercase tracking-wide hover:text-primary transition-colors flex items-center gap-1'>
									<i className='fas fa-envelope'></i> Email
								</a>
							</div>
						</div>
					)}
				</div>
			)}

			<style>{`
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `}</style>
		</div>
	);
};

export default Ai;
