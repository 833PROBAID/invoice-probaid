import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Management = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [adminName, setAdminName] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		const name = localStorage.getItem("adminName");

		if (!token) {
			navigate("/management-login");
			return;
		}

		if (name) {
			setAdminName(name);
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("adminName");
		navigate("/management-login");
	};

	const menuItems = [
		{
			path: "/management/invoices",
			icon: "fa-file-invoice-dollar",
			label: "Invoice Management",
		},
		{
			path: "/management/quiz-users",
			icon: "fa-users",
			label: "Quiz Users",
		},
		{
			path: "/management/quiz-submissions",
			icon: "fa-clipboard-check",
			label: "Quiz Submissions",
		},
	];

	const isActive = (path) => location.pathname === path;

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Top Navigation Bar */}
			<div className='fixed top-0 left-0 right-0 bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white shadow-lg z-50'>
				<div className='flex items-center justify-between px-4 py-4'>
					<div className='flex items-center'>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className='mr-4 p-2 rounded-lg hover:bg-white/10 lg:hidden'>
							<i className='fas fa-bars text-xl'></i>
						</button>
						<h1 className='text-2xl font-bold'>Management Dashboard</h1>
					</div>
					<div className='flex items-center space-x-4'>
						<div className='hidden sm:flex items-center space-x-2'>
							<i className='fas fa-user-circle text-2xl'></i>
							<span className='font-semibold'>{adminName || "Admin"}</span>
						</div>
						<button
							onClick={handleLogout}
							className='flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors'>
							<i className='fas fa-sign-out-alt'></i>
							<span className='hidden sm:inline'>Logout</span>
						</button>
					</div>
				</div>
			</div>

			<div className='flex pt-[72px]'>
				{/* Sidebar */}
				<aside
					className={`fixed top-[72px] bottom-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none ${
						sidebarOpen ? "translate-x-0" : "-translate-x-full"
					} lg:translate-x-0 overflow-y-auto`}>
					<nav className='p-4 space-y-2'>
						{menuItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setSidebarOpen(false)}
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
									isActive(item.path)
										? "bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white shadow-md"
										: "text-gray-700 hover:bg-gray-100"
								}`}>
								<i className={`fas ${item.icon} text-lg`}></i>
								<span className='font-semibold'>{item.label}</span>
							</Link>
						))}
					</nav>
				</aside>

				{/* Overlay for mobile */}
				{sidebarOpen && (
					<div
						className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
						onClick={() => setSidebarOpen(false)}></div>
				)}

				{/* Main Content */}
				<main className='flex-1 lg:ml-72 p-4 lg:p-8 overflow-x-hidden'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Management;
