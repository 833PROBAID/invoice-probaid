import { useData } from "./Context";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";

const Navigation = ({ current }) => {
	const { menus } = useData();
	const [showPrevSelect, setShowPrevSelect] = useState(false);
	const [showNextSelect, setShowNextSelect] = useState(false);
	const prevDropdownRef = useRef();
	const nextDropdownRef = useRef();
	const [prevPosition, setPrevPosition] = useState("bottom");
	const [nextPosition, setNextPosition] = useState("bottom");

	const currentIndex = menus.findIndex((menu) => menu.to === current);
	const prevMenu = currentIndex > 0 ? menus[currentIndex - 1] : null;
	const nextMenu =
		currentIndex < menus.length - 1 ? menus[currentIndex + 1] : null;

	return (
		<div className='flex justify-between items-center my-4 md:my-8 max-w-7xl mx-auto'>
			{prevMenu && (
				<div
					className='relative'
					onMouseEnter={() => {
						setShowPrevSelect(true);
						setTimeout(() => {
							if (prevDropdownRef.current) {
								const rect = prevDropdownRef.current.getBoundingClientRect();
								if (rect.bottom > window.innerHeight - 10) {
									setPrevPosition("top");
								} else {
									setPrevPosition("bottom");
								}
							}
						}, 0);
					}}
					onMouseLeave={() => setShowPrevSelect(false)}>
					<Link
						to={prevMenu.to}
						className='group flex items-center gap-1 md:gap-2 text-colorTeal hover:text-colorOrange transition-colors text-xl font-bold'>
						<i className='fas fa-turn-down rotate-90 text-4xl mt-1.5 mr-1 text-colorOrange group-hover:text-colorTeal transition-colors' />
						<span className='hidden md:inline'>{prevMenu.text}</span>
						<span className='md:hidden'>Previous</span>
					</Link>
					<div
						ref={prevDropdownRef}
						className={`absolute ${
							prevPosition === "top" ? "bottom-full" : "top-full"
						} left-1/2 transform -translate-x-1/2 bg-white border-2 border-colorTeal rounded shadow-lg z-50 w-max ${
							showPrevSelect ? "block" : "hidden"
						}`}>
						{menus.slice(0, currentIndex).map((menu) => (
							<Link
								key={menu.to}
								to={menu.to}
								className='p-2 font-bold text-colorTeal hover:text-colorOrange border-b-2 border-colorTeal flex items-center gap-1'
								style={{ lineHeight: "1" }}>
								<i className='fas fa-turn-down rotate-90 text-lg mr-1 text-colorTeal hover:text-colorOrange' />
								{menu.text}
							</Link>
						))}
					</div>
				</div>
			)}

			<Link
				to='/'
				className='group flex items-center gap-1 md:gap-2 text-colorTeal hover:text-colorOrange transition-colors text-xl font-bold'>
				<i className='fas fa-home text-colorOrange group-hover:text-colorTeal transition-colors text-xl' />
				<span className='hidden md:inline'>Home</span>
			</Link>

			{nextMenu && (
				<div
					className='relative'
					onMouseEnter={() => {
						setShowNextSelect(true);
						setTimeout(() => {
							if (nextDropdownRef.current) {
								const rect = nextDropdownRef.current.getBoundingClientRect();
								if (rect.bottom > window.innerHeight - 10) {
									setNextPosition("top");
								} else {
									setNextPosition("bottom");
								}
							}
						}, 0);
					}}
					onMouseLeave={() => setShowNextSelect(false)}>
					<Link
						to={nextMenu.to}
						className='group flex items-center gap-1 md:gap-2 text-colorTeal hover:text-colorOrange transition-colors text-xl font-bold'>
						<span className='hidden md:inline'>{nextMenu.text}</span>
						<span className='md:hidden'>Next</span>
						<i className='fas fa-turn-up rotate-90 text-4xl mt-1.5 text-colorOrange group-hover:text-colorTeal transition-colors ml-1' />
					</Link>
					<div
						ref={nextDropdownRef}
						className={`absolute ${
							nextPosition === "top" ? "bottom-full" : "top-full"
						} left-1/2 transform -translate-x-1/2 bg-white border-2 border-colorTeal rounded shadow-lg z-50 w-max ${
							showNextSelect ? "block" : "hidden"
						}`}>
						{menus.slice(currentIndex + 1).map((menu) => (
							<Link
								key={menu.to}
								to={menu.to}
								className='p-2 font-bold text-colorTeal hover:text-colorOrange border-b-2 border-colorTeal flex items-center justify-end gap-1'
								style={{ lineHeight: "1" }}>
								{menu.text}
								<i className='fas fa-turn-up rotate-90 text-lg ml-1 text-colorTeal hover:text-colorOrange' />
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Navigation;
