import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Shared/firebaseConfig";
import { useData } from "../../Shared/Context";
import Swal from "sweetalert2";

const Dashboard = () => {
	const { user } = useData();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	// Close mobile menu on route change
	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	const navItems = [
		{ path: "/dashboard/listings", label: "Listings", icon: "fas fa-home" },
		{ path: "/dashboard/blogs", label: "Blogs", icon: "fas fa-blog" },
		{ path: "/dashboard/videos", label: "Videos", icon: "fas fa-video" },
		{
			path: "/dashboard/downloadRequests",
			label: "Download Requests",
			icon: "fas fa-download",
		},
		{
			path: "/dashboard/subscribers",
			label: "Subscribers",
			icon: "fas fa-users",
		},
	];

	const toggleSidebar = () => setCollapsed(!collapsed);

	const isActiveRoute = (navPath) => {
		const navSegment = navPath.split("/")[2];
		const currentPathSegments = location.pathname.split("/");
		const currentMainSegment = currentPathSegments[2];

		if (currentMainSegment === navSegment) return true;

		const relatedRoutes = {
			blogs: ["addBlog", "editBlog", "viewBlog"],
			videos: ["addVideo", "editVideo", "viewVideo"],
			listings: ["addListing", "editListing", "viewListing"],
		};

		return relatedRoutes[navSegment]?.includes(currentMainSegment) || false;
	};

	return (
		<div className='bg-gray-100 dark:bg-darkBackground min-h-screen flex flex-col'>
			{/* Top navigation bar - now fixed */}
			<header className='bg-colorTeal dark:bg-darkBackground border-b border-tealSoft dark:border-gray-700 shadow-sm fixed top-0 left-0 right-0 z-20'>
				<div className='flex items-center justify-between px-4 h-16'>
					{/* Left side - Logo and toggle */}
					<div className='flex items-center'>
						<button
							onClick={toggleSidebar}
							className='text-white dark:text-darkText focus:outline-none mr-4 hover:bg-teal-500 p-1 rounded hidden sm:block'>
							<i
								className={`fas ${
									collapsed ? "fa-indent" : "fa-outdent"
								} text-lg`}></i>
						</button>
						<span className='text-xl font-bold text-white dark:text-darkText'>
							833PROBAID<sup>TM</sup>
						</span>
					</div>

					{/* Mobile menu button */}
					<button
						className='md:hidden text-white dark:text-darkText hover:bg-teal-500 p-1 rounded focus:outline-none'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						<i
							className={`fas ${
								mobileMenuOpen ? "fa-times" : "fa-bars"
							} text-lg`}></i>
					</button>

					{/* Right side - User profile and actions */}
					<div className='hidden md:flex items-center space-x-4'>
						<div className='flex items-center  pl-4 '>
							<div className='ml-2'>
								<button
									onClick={() => {
										Swal.fire({
											title: "Sign Out",
											text: "Are you sure you want to sign out?",
											icon: "question",
											showCancelButton: true,
											confirmButtonText: "Yes, sign out",
											confirmButtonColor: "#14b8a6",
											cancelButtonColor: "#6b7280",
											reverseButtons: true,
										}).then((result) => {
											if (result.isConfirmed) {
												signOut(auth);
											}
										});
									}}
									className='text-xs bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded transition-colors duration-200 mt-1'>
									Sign out <i className='fas fa-sign-out-alt ml-1.5'></i>
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div className='md:hidden bg-teal-500 dark:bg-gray-800 border-t border-tealSoft dark:border-gray-700 py-2'>
						<nav>
							{navItems.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className={`flex items-center px-4 py-3 ${
										isActiveRoute(item.path)
											? "bg-teal-600 dark:bg-gray-900 text-white"
											: "text-white dark:text-gray-300 hover:bg-teal-600 dark:hover:bg-gray-700"
									}`}>
									<i className={`${item.icon} w-6 text-center`}></i>
									<span className='ml-2'>{item.label}</span>
								</Link>
							))}
						</nav>
						<div className='border-t border-tealSoft dark:border-gray-700 pt-2 pb-1 px-4 mt-2'>
							<button
								onClick={() => {
									Swal.fire({
										title: "Are you sure?",
										text: "You will be logged out.",
										icon: "warning",
										showCancelButton: true,
										confirmButtonText: "Yes, sign out!",
									}).then((result) => {
										if (result.isConfirmed) {
											signOut(auth);
										}
									});
								}}
								className='flex items-center text-white dark:text-gray-300 hover:text-tealSoft'>
								<i className='fas fa-sign-out-alt w-6 text-center'></i>
								<span className='ml-2'>Sign out</span>
							</button>
						</div>
					</div>
				)}
			</header>

			{/* Main container with proper spacing for fixed header */}
			<div className='flex flex-1 overflow-hidden pt-16'>
				{/* Sidebar - already fixed */}
				<aside
					className={`bg-teal-50 dark:bg-gray-900 border-r border-tealSoft dark:border-gray-700 transition-all duration-300 ${
						collapsed ? "w-20" : "w-64"
					} hidden md:block fixed h-[calc(100vh-4rem)] top-16 left-0 z-10`}>
					<nav className='mt-6 px-2'>
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center ${
									collapsed ? "justify-center" : ""
								} py-3 px-3 mb-2 rounded-lg ${
									isActiveRoute(item.path)
										? "bg-colorTeal dark:bg-gray-800 text-white"
										: "text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-gray-800"
								} transition-colors duration-200`}
								title={collapsed ? item.label : ""}>
								<i
									className={`${item.icon} ${
										collapsed ? "text-xl" : "mr-3"
									}`}></i>
								{!collapsed && <span>{item.label}</span>}
							</Link>
						))}
					</nav>
				</aside>

				{/* Main content - Only this will scroll */}
				<main
					className={`flex-1 overflow-auto bg-gray-100 dark:bg-darkBackground ml-0 w-full h-[calc(100vh - 4rem)]`}
					style={{
						marginLeft: collapsed ? "5rem" : "16rem",
						transition: "margin-left 0.3s ease-in-out",
					}}>
					{/* Page content */}
					<div className='p-6'>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default Dashboard;
