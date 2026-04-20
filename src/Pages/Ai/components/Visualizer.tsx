import React from "react";
import { motion } from "framer-motion";

const Visualizer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
	return (
		<div className='flex items-center justify-center gap-1.5 h-10 mt-2'>
			{[1, 2, 3, 4, 5].map((i) => (
				<motion.div
					key={i}
					className='w-2 rounded-full bg-gradient-to-t from-primary to-cyan-300'
					animate={{
						height: isActive ? [10, 30, 15, 35, 10] : 6,
						opacity: isActive ? 1 : 0.5,
					}}
					transition={{
						duration: 0.6,
						repeat: Infinity,
						repeatType: "reverse",
						delay: i * 0.1,
						ease: "easeInOut",
					}}
				/>
			))}
		</div>
	);
};

export default Visualizer;
