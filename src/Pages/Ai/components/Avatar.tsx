import React, { useEffect, useState, useRef } from "react";
import {
	motion,
	useMotionValue,
	useTransform,
	useSpring,
	Variants,
} from "framer-motion";

interface AvatarProps {
	isSpeaking: boolean;
	isListening: boolean;
	mood: "neutral" | "happy" | "thinking";
}

const Avatar: React.FC<AvatarProps> = ({ isSpeaking, isListening, mood }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	// --- Physics-based Mouse Tracking (Parallax) ---
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Smooth springs for tracking
	const headX = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), {
		stiffness: 60,
		damping: 15,
	});
	const headY = useSpring(useTransform(mouseY, [-1, 1], [-3, 3]), {
		stiffness: 60,
		damping: 15,
	});

	const faceX = useTransform(headX, (x) => x * 1.2);
	const faceY = useTransform(headY, (y) => y * 1.1);
	const eyeX = useTransform(headX, (x) => x * 1.6);
	const eyeY = useTransform(headY, (y) => y * 1.4);

	const [blink, setBlink] = useState(false);

	// --- Mouse Event Handler ---
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
			mouseX.set(x);
			mouseY.set(y);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	// --- Blinking Logic ---
	useEffect(() => {
		const triggerBlink = () => {
			setBlink(true);
			setTimeout(() => setBlink(false), 150);

			if (Math.random() > 0.8) {
				setTimeout(() => {
					setBlink(true);
					setTimeout(() => setBlink(false), 120);
				}, 200);
			}
			const nextBlink = 3000 + Math.random() * 4000;
			setTimeout(triggerBlink, nextBlink);
		};
		const initialTimeout = setTimeout(triggerBlink, 2000);
		return () => clearTimeout(initialTimeout);
	}, []);

	// --- Animation Variants ---

	const breathingVariant: Variants = {
		animate: {
			y: [0, -1.5, 0],
			transition: {
				duration: 4.5,
				ease: "easeInOut",
				repeat: Infinity,
			},
		},
	};

	const headSpeakingVariant: Variants = {
		speaking: {
			y: [0, 1, -0.5, 0],
			rotate: [0, -0.5, 0.5, 0],
			transition: {
				duration: 2,
				ease: "easeInOut",
				repeat: Infinity,
			},
		},
		idle: {
			y: 0,
			rotate: 0,
			transition: { duration: 0.5 },
		},
		listening: {
			rotate: 1.5,
			y: 1,
			transition: { duration: 0.5 },
		},
	};

	const hairSwayVariant: Variants = {
		animate: {
			rotate: [-0.5, 0.5, -0.5],
			transition: {
				duration: 6,
				ease: "easeInOut",
				repeat: Infinity,
			},
		},
	};

	return (
		<div
			ref={containerRef}
			className='relative w-72 h-72 sm:w-80 sm:h-80 -mt-14 flex items-center justify-center'>
			{/* Speaking Aura */}
			<motion.div
				animate={{
					scale: isSpeaking ? [0.95, 1.05, 0.95] : 0.95,
					opacity: isSpeaking ? 0.4 : 0,
				}}
				transition={{ duration: 2, repeat: Infinity }}
				className='absolute w-60 h-60 bg-gradient-to-tr from-cyan-100 to-blue-50 rounded-full blur-3xl -z-10'
			/>

			<svg
				viewBox='0 0 400 400'
				className='w-full h-full overflow-visible drop-shadow-xl'>
				<defs>
					{/* Skin Gradient - Soft & Realistic */}
					<radialGradient id='skinGrad' cx='0.5' cy='0.4' r='0.6'>
						<stop offset='0%' stopColor='#FFF5EB' />
						<stop offset='60%' stopColor='#F5D0B5' />
						<stop offset='100%' stopColor='#E0B696' />
					</radialGradient>

					{/* Hair Gradient - Rich Brown */}
					<linearGradient id='hairGrad' x1='0' y1='0' x2='1' y2='1'>
						<stop offset='0%' stopColor='#4A342E' />
						<stop offset='50%' stopColor='#3E2723' />
						<stop offset='100%' stopColor='#2D1B18' />
					</linearGradient>

					{/* Suit Gradient - Charcoal Professional */}
					<linearGradient id='suitGrad' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='0%' stopColor='#4B5563' />
						<stop offset='100%' stopColor='#374151' />
					</linearGradient>

					{/* Eye Gradient */}
					<radialGradient id='irisGrad' cx='0.3' cy='0.3' r='0.8'>
						<stop offset='0%' stopColor='#8D6E63' />
						<stop offset='60%' stopColor='#4E342E' />
						<stop offset='100%' stopColor='#271C19' />
					</radialGradient>

					{/* Shadows */}
					<filter id='softBlur' x='-20%' y='-20%' width='140%' height='140%'>
						<feGaussianBlur stdDeviation='2' />
					</filter>

					<filter id='deepShadow' x='-50%' y='-50%' width='200%' height='200%'>
						<feDropShadow
							dx='0'
							dy='4'
							stdDeviation='4'
							floodColor='#000'
							floodOpacity='0.2'
						/>
					</filter>
				</defs>

				{/* --- 2. BODY & CLOTHING (Breathing) --- */}
				<motion.g variants={breathingVariant} animate='animate'>
					<g transform='translate(0, 20)'>
						{/* Shoulders / Blazer Body */}
						<path
							d='M60,320 Q60,300 100,290 L300,290 Q340,300 340,320 L340,450 L60,450 Z'
							fill='url(#suitGrad)'
							filter='url(#deepShadow)'
						/>
						{/* White Shirt Underneath */}
						<path
							d='M150,290 L200,380 L250,290 L250,270 L200,270 L150,270 Z'
							fill='#F9FAFB'
						/>
						{/* Neck Base (Connecting head to body) */}
						<path d='M165,220 L235,220 L235,300 L165,300 Z' fill='#E0B696' />
						{/* Neck Shadow (Under chin) */}
						<path
							d='M165,220 L235,220 L235,260 Q200,270 165,260 Z'
							fill='#C49A7A'
							opacity='0.4'
						/>
						{/* Shirt Collar (Front) */}
						<path d='M150,290 L200,340 L195,280 Z' fill='#E5E7EB' />{" "}
						{/* Left collar fold */}
						<path d='M250,290 L200,340 L205,280 Z' fill='#E5E7EB' />{" "}
						{/* Right collar fold */}
						<path
							d='M150,290 L200,340 L250,290'
							stroke='#D1D5DB'
							strokeWidth='0.5'
							fill='none'
						/>
						{/* Blazer Lapels (V-Shape) */}
						<path d='M150,290 L200,390 L130,420 L100,330 Z' fill='#374151' />
						<path d='M250,290 L200,390 L270,420 L300,330 Z' fill='#374151' />
					</g>
				</motion.g>

				{/* --- 3. HEAD & FACE (Tracking) --- */}
				<motion.g
					style={{ x: headX, y: headY }}
					variants={headSpeakingVariant}
					animate={
						isSpeaking ? "speaking" : isListening ? "listening" : "idle"
					}>
					{/* Face Shape */}
					<path
						d='M130,150 C130,60 270,60 270,150 C270,230 245,280 200,290 C155,280 130,230 130,150 Z'
						fill='url(#skinGrad)'
						filter='url(#deepShadow)'
					/>

					{/* --- FEATURES (Parallax) --- */}
					<motion.g style={{ x: faceX, y: faceY }}>
						{/* Ears */}
						<ellipse cx='128' cy='170' rx='8' ry='14' fill='#F5D0B5' />
						<ellipse cx='272' cy='170' rx='8' ry='14' fill='#F5D0B5' />

						{/* Nose (Subtle 3D) */}
						<path
							d='M200,190 Q195,210 196,225 Q200,230 204,225'
							fill='none'
							stroke='#D4A585'
							strokeWidth='2'
							strokeLinecap='round'
						/>
						<ellipse
							cx='200'
							cy='220'
							rx='6'
							ry='3'
							fill='#000'
							opacity='0.1'
							filter='url(#softBlur)'
						/>

						{/* Eyebrows */}
						<motion.path
							d='M150,155 Q170,148 190,155'
							stroke='#3E2723'
							strokeWidth='3'
							fill='none'
							strokeLinecap='round'
							animate={mood === "thinking" ? { y: -2, rotate: -2 } : { y: 0 }}
						/>
						<motion.path
							d='M210,155 Q230,148 250,155'
							stroke='#3E2723'
							strokeWidth='3'
							fill='none'
							strokeLinecap='round'
							animate={mood === "thinking" ? { y: 2, rotate: 2 } : { y: 0 }}
						/>

						{/* --- EYES --- */}
						<motion.g style={{ x: eyeX, y: eyeY }}>
							<g transform='translate(0, 0)'>
								{/* Left Eye */}
								<g transform='translate(165, 175)'>
									<path d='M-18,0 Q0,-12 18,0 Q0,12 -18,0 Z' fill='white' />
									<circle r='7.5' fill='url(#irisGrad)' />
									<circle r='3.5' fill='#111' />
									<circle cx='-3' cy='-3' r='2' fill='white' opacity='0.8' />
									{/* Eyelid */}
									<motion.path
										d='M-18,0 Q0,-12 18,0'
										stroke='#E0B696'
										strokeWidth={blink ? 24 : 0}
										strokeLinecap='round'
										animate={{ strokeWidth: blink ? 24 : 0 }}
										transition={{ duration: 0.1 }}
									/>
									{/* Lash Line */}
									<path
										d='M-18,0 Q0,-13 18,0'
										stroke='#2D1B18'
										strokeWidth='2.5'
										fill='none'
									/>
								</g>

								{/* Right Eye */}
								<g transform='translate(235, 175)'>
									<path d='M-18,0 Q0,-12 18,0 Q0,12 -18,0 Z' fill='white' />
									<circle r='7.5' fill='url(#irisGrad)' />
									<circle r='3.5' fill='#111' />
									<circle cx='-3' cy='-3' r='2' fill='white' opacity='0.8' />
									{/* Eyelid */}
									<motion.path
										d='M-18,0 Q0,-12 18,0'
										stroke='#E0B696'
										strokeWidth={blink ? 24 : 0}
										strokeLinecap='round'
										animate={{ strokeWidth: blink ? 24 : 0 }}
										transition={{ duration: 0.1 }}
									/>
									{/* Lash Line */}
									<path
										d='M-18,0 Q0,-13 18,0'
										stroke='#2D1B18'
										strokeWidth='2.5'
										fill='none'
									/>
								</g>
							</g>
						</motion.g>

						{/* --- MOUTH (Lip Sync) --- */}
						<motion.path
							fill='#C06F6F'
							initial={{ d: "M185,260 Q200,263 215,260 Q200,260 185,260" }}
							animate={
								isSpeaking
									? {
											d: [
												"M188,260 Q200,270 212,260 Q200,250 188,260", // Open O
												"M184,260 Q200,265 216,260 Q200,255 184,260", // E
												"M188,260 Q200,275 212,260 Q200,252 188,260", // Ah
											],
									  }
									: mood === "happy" || isListening
									? { d: "M184,258 Q200,268 216,258 Q200,258 184,258" } // Smile
									: { d: "M185,260 Q200,263 215,260 Q200,260 185,260" } // Neutral
							}
							transition={
								isSpeaking
									? { duration: 0.35, repeat: Infinity, ease: "linear" }
									: { duration: 0.5 }
							}
						/>
					</motion.g>

					{/* --- 4. FRONT HAIR (Framing Face) --- */}
					<motion.g
						style={{
							x: useTransform(headX, (x) => x * 1.1),
							y: useTransform(headY, (y) => y * 1.1),
						}}
						filter='url(#deepShadow)'>
						{/* Hair Parting & Volume - Darker Roots, Lighter Ends */}

						{/* Right Side Swoop */}
						<path
							d='M200,60 C240,60 280,90 290,160 Q295,220 290,280 L270,280 Q270,200 250,140 Q230,100 200,90'
							fill='url(#hairGrad)'
						/>

						{/* Left Side Swoop (Over Forehead) */}
						<path
							d='M200,60 C160,60 110,90 110,180 Q110,240 120,300 L140,290 Q135,200 160,140 Q180,100 200,90'
							fill='url(#hairGrad)'
						/>

						{/* Shine Lines */}
						<path
							d='M140,110 Q160,90 190,95'
							stroke='white'
							strokeOpacity='0.1'
							strokeWidth='3'
							fill='none'
							strokeLinecap='round'
						/>
					</motion.g>
				</motion.g>
			</svg>
		</div>
	);
};

export default Avatar;
