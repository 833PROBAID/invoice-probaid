import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import AiChatInterface from "../Components/AiChatInterface";

// Question groups definition
const questionGroups = {
	foundation: ["letters", "certificate", "attorney"],
	readiness: ["insurance", "referee", "timeline"],
	operations: ["access", "occupant", "utilities", "secured"],
};

// Quiz questions definition
const questions = [
	{
		id: "letters",
		question:
			"Do you have Letters Testamentary (or Letters of Administration)?",
		group: "foundation",
		recommendation:
			"Probate authority must be issued before real estate actions can proceed. Coordinate with probate counsel to obtain Letters.",
		isOccupancyQuestion: false,
	},
	{
		id: "certificate",
		question: "Do you have certified copies of the death certificate?",
		group: "foundation",
		recommendation:
			"Certified copies are required for title, banking, and insurance. Order multiple originals immediately.",
		isOccupancyQuestion: false,
	},
	{
		id: "attorney",
		question: "Has probate counsel been retained?",
		group: "foundation",
		recommendation:
			"Retaining probate counsel helps manage filings, deadlines, and court approvals before sale.",
		isOccupancyQuestion: false,
	},
	{
		id: "referee",
		question: "Has a probate referee been assigned (if required)?",
		group: "readiness",
		recommendation:
			"A referee valuation is required before listing in many probate cases. Confirm assignment status.",
		isOccupancyQuestion: false,
	},
	{
		id: "access",
		question: "Is property access established?",
		group: "operations",
		recommendation:
			"Secure authorized access for inspections, valuation, and preparation.",
		isOccupancyQuestion: false,
	},
	{
		id: "occupant",
		question: "What is the occupant status of the property?",
		group: "operations",
		recommendation:
			"Occupancy affects timelines and strategy. Resolve access or relocation issues before listing.",
		isOccupancyQuestion: true,
	},
	{
		id: "insurance",
		question: "Is insurance updated to reflect estate ownership?",
		group: "readiness",
		recommendation:
			"Insurance must reflect estate or trust ownership to prevent coverage gaps.",
		isOccupancyQuestion: false,
	},
	{
		id: "utilities",
		question: "Are utilities active and transferred appropriately?",
		group: "operations",
		recommendation:
			"Active utilities are required for showings, inspections, and insurance compliance.",
		isOccupancyQuestion: false,
	},
	{
		id: "secured",
		question: "Is the property secured?",
		group: "operations",
		recommendation:
			"Securing the property reduces liability and insurance exposure.",
		isOccupancyQuestion: false,
	},
	{
		id: "timeline",
		question:
			"Has a sale timeline been aligned with counsel and beneficiaries?",
		group: "readiness",
		recommendation:
			"Align expectations to prevent disputes and delays once the property is listed.",
		isOccupancyQuestion: false,
	},
];

const QuizManagement = ({ defaultTab = "users" }) => {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [submissions, setSubmissions] = useState([]);
	const [stats, setStats] = useState(null);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [loadingSubmissions, setLoadingSubmissions] = useState(false);
	const [loadingStats, setLoadingStats] = useState(true);
	const [deletingId, setDeletingId] = useState(null);
	const [selectedSubmission, setSelectedSubmission] = useState(null);
	const [loadingSubmissionDetail, setLoadingSubmissionDetail] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [inputValue, setInputValue] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [userIdFilter, setUserIdFilter] = useState(""); // For filtering submissions by userId
	const [filters, setFilters] = useState({
		relationship: "all",
		startDate: "",
		endDate: "",
		minScore: "",
		maxScore: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const API_URL = import.meta.env.VITE_API_URL || "https://invoice.833probate.com/api";

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/management-login");
			return;
		}

		// Get user from URL params if present
		const urlParams = new URLSearchParams(window.location.search);
		const userParam = urlParams.get("user");
		if (userParam) {
			setUserIdFilter(userParam);
		}

		fetchStats();
		if (defaultTab === "users") {
			fetchUsers();
		} else if (defaultTab === "submissions") {
			fetchSubmissions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [defaultTab, currentPage, searchTerm, filters, userIdFilter, navigate]);

	const fetchStats = async () => {
		setLoadingStats(true);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${API_URL}/quiz/stats`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setStats(data);
		} catch (error) {
			console.error("Error fetching stats:", error);
		} finally {
			setLoadingStats(false);
		}
	};

	const fetchUsers = async () => {
		setLoadingUsers(true);
		setIsSearching(true);
		try {
			const token = localStorage.getItem("token");
			const params = new URLSearchParams({
				page: currentPage,
				limit: 20,
				...(searchTerm && { search: searchTerm }),
				...(filters.relationship !== "all" && {
					relationship: filters.relationship,
				}),
				...(filters.startDate && { startDate: filters.startDate }),
				...(filters.endDate && { endDate: filters.endDate }),
				sortBy: filters.sortBy,
				sortOrder: filters.sortOrder,
			});

			const response = await fetch(`${API_URL}/quiz/users?${params}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setUsers(data.users);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoadingUsers(false);
			setIsSearching(false);
		}
	};

	const fetchSubmissions = async () => {
		setLoadingSubmissions(true);
		setIsSearching(true);
		try {
			const token = localStorage.getItem("token");
			const params = new URLSearchParams({
				page: currentPage,
				limit: 20,
				...(searchTerm && { search: searchTerm }),
				...(userIdFilter && { user: userIdFilter }), // Filter by user if present
				sortOrder: filters.sortOrder,
			});

			const response = await fetch(`${API_URL}/quiz/submissions?${params}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			setSubmissions(data.submissions);
			setTotalPages(data.totalPages);
		} catch (error) {
			console.error("Error fetching submissions:", error);
		} finally {
			setLoadingSubmissions(false);
			setIsSearching(false);
		}
	};

	const viewSubmissionDetail = async (submissionId) => {
		setLoadingSubmissionDetail(true);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${API_URL}/quiz/submissions/${submissionId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const data = await response.json();
			setSelectedSubmission(data);
		} catch (error) {
			console.error("Error fetching submission details:", error);
		} finally {
			setLoadingSubmissionDetail(false);
		}
	};

	const deleteUser = async (userId) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this user and all their submissions?",
			)
		) {
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(`${API_URL}/quiz/users/${userId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				alert("User deleted successfully");
				fetchUsers();
				fetchStats();
			} else {
				alert("Failed to delete user");
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("An error occurred while deleting user");
		}
	};

	const deleteSubmission = async (submissionId) => {
		if (!window.confirm("Are you sure you want to delete this submission?")) {
			return;
		}

		setDeletingId(submissionId);
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`${API_URL}/quiz/submissions/${submissionId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.ok) {
				// Update local state immediately
				setSubmissions(submissions.filter((s) => s._id !== submissionId));
				fetchStats();
			} else {
				const error = await response.json();
				alert(error.message || "Failed to delete submission");
			}
		} catch (error) {
			console.error("Error deleting submission:", error);
			alert("An error occurred while deleting submission");
		} finally {
			setDeletingId(null);
		}
	};

	const getReadinessBadgeColor = (percentage) => {
		if (percentage < 40) return "bg-red-100 text-red-800 border-red-300";
		if (percentage < 70)
			return "bg-orange-100 text-orange-800 border-orange-300";
		if (percentage < 90)
			return "bg-yellow-100 text-yellow-800 border-yellow-300";
		return "bg-green-100 text-green-800 border-green-300";
	};

	// Calculate group scores from selected submission answers
	const groupScores = useMemo(() => {
		if (!selectedSubmission?.answers) return [];

		return Object.entries(questionGroups).map(([groupId, ids]) => {
			const earned = ids.reduce(
				(sum, questionId) =>
					sum + (selectedSubmission.answers[questionId] || 0),
				0,
			);
			const max = ids.length * 10;
			return {
				groupId,
				label:
					groupId === "foundation"
						? "Court Foundations"
						: groupId === "readiness"
						? "Process Alignment"
						: "Operational Control",
				percent: max ? Math.round((earned / max) * 100) : 0,
			};
		});
	}, [selectedSubmission]);

	const getAnswerLabel = (points, isOccupancyQuestion) => {
		if (isOccupancyQuestion) {
			if (points === 10)
				return {
					label: "Vacant",
					color: "text-green-600",
					bgColor: "bg-green-50",
				};
			if (points === 5)
				return {
					label: "Occupied - Cooperative",
					color: "text-orange-600",
					bgColor: "bg-orange-50",
				};
			return {
				label: "Occupied - Unresolved",
				color: "text-red-600",
				bgColor: "bg-red-50",
			};
		}
		if (points === 10)
			return { label: "Yes", color: "text-green-600", bgColor: "bg-green-50" };
		if (points === 5)
			return {
				label: "In Progress",
				color: "text-orange-600",
				bgColor: "bg-orange-50",
			};
		return { label: "No", color: "text-red-600", bgColor: "bg-red-50" };
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className='w-full bg-gray-50 min-h-screen overflow-x-hidden'>
			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fade-in 0.5s ease-out;
				}
			`}</style>
			<div className='overflow-x-hidden'>
				{/* Header - Quiz Users */}
				{defaultTab === "users" && (
					<div className='bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white rounded-lg shadow-lg p-6 mb-6'>
						<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
							<div>
								<h1 className='text-3xl font-bold flex items-center gap-3'>
									<i className='fas fa-users'></i>
									Quiz Users
								</h1>
								<p className='text-white/90 mt-2'>
									Manage registered users and view their quiz participation
									history
								</p>
							</div>
							<div className='mt-4 sm:mt-0'>
								<div className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2'>
									<div className='text-xs uppercase tracking-wide opacity-80'>
										Total Users
									</div>
									<div className='text-2xl font-bold'>
										{stats?.totalUsers || 0}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Header - Quiz Submissions */}
				{defaultTab === "submissions" && (
					<div className='bg-gradient-to-r from-[#FD7702] to-[#E66902] text-white rounded-lg shadow-lg p-6 mb-6'>
						<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
							<div>
								<h1 className='text-3xl font-bold flex items-center gap-3'>
									<i className='fas fa-clipboard-check'></i>
									Quiz Submissions
								</h1>
								<p className='text-white/90 mt-2'>
									View all quiz submissions with readiness scores and tier
									assessments
								</p>
							</div>
							<div className='mt-4 sm:mt-0 grid grid-cols-2 gap-3'>
								<div className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2'>
									<div className='text-xs uppercase tracking-wide opacity-80'>
										Total
									</div>
									<div className='text-2xl font-bold'>
										{stats?.totalSubmissions || 0}
									</div>
								</div>
								<div className='bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2'>
									<div className='text-xs uppercase tracking-wide opacity-80'>
										Avg Score
									</div>
									<div className='text-2xl font-bold'>
										{stats?.averageScore || 0}%
									</div>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Stats Cards - Users Tab */}
				{stats && defaultTab === "users" && (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Executors/Trustees
							</div>
							<div className='text-2xl font-bold text-blue-600 mt-2'>
								{
									users.filter((u) =>
										["executor", "trustee", "administrator"].includes(
											u.relationship,
										),
									).length
								}
							</div>
						</div>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Professionals
							</div>
							<div className='text-2xl font-bold text-purple-600 mt-2'>
								{
									users.filter((u) =>
										["attorney", "real-estate-agent"].includes(u.relationship),
									).length
								}
							</div>
						</div>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Active This Month
							</div>
							<div className='text-2xl font-bold text-green-600 mt-2'>
								{stats.monthSubmissions}
							</div>
						</div>
					</div>
				)}

				{/* Stats Cards - Submissions Tab */}
				{stats && defaultTab === "submissions" && (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Listing Ready
							</div>
							<div className='text-2xl font-bold text-green-600 mt-2'>
								{submissions.filter((s) => s.results.percentage >= 90).length}
							</div>
						</div>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Pre-Listing
							</div>
							<div className='text-2xl font-bold text-blue-600 mt-2'>
								{
									submissions.filter(
										(s) =>
											s.results.percentage >= 70 && s.results.percentage < 90,
									).length
								}
							</div>
						</div>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Preparation Phase
							</div>
							<div className='text-2xl font-bold text-orange-600 mt-2'>
								{
									submissions.filter(
										(s) =>
											s.results.percentage >= 40 && s.results.percentage < 70,
									).length
								}
							</div>
						</div>
						<div className='bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500'>
							<div className='text-sm text-gray-500 uppercase font-semibold'>
								Foundation Work
							</div>
							<div className='text-2xl font-bold text-red-600 mt-2'>
								{submissions.filter((s) => s.results.percentage < 40).length}
							</div>
						</div>
					</div>
				)}

				{/* Content */}
				<div className='bg-white rounded-lg shadow-md border border-gray-200'>
					<div className='p-6'>
						{/* Search and Filters - Users Tab */}
						{defaultTab === "users" && (
							<>
								<div className='mb-6'>
									<div className='flex gap-2 items-center'>
										<div className='relative flex-1'>
											<input
												type='text'
												placeholder='Search by name, email, or phone...'
												value={inputValue}
												onChange={(e) => setInputValue(e.target.value)}
												onBlur={() => {
													setSearchTerm(inputValue);
													setCurrentPage(1);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														setSearchTerm(inputValue);
														setCurrentPage(1);
													}
												}}
												className='w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal transition-colors'
											/>
											<i className='fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
											{isSearching && (
												<i className='fas fa-spinner fa-spin absolute right-4 top-1/2 transform -translate-y-1/2 text-colorTeal'></i>
											)}
										</div>
										<button
											onClick={() => setShowFilters(!showFilters)}
											className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
												showFilters
													? "bg-colorTeal text-white"
													: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											}`}>
											<i className='fas fa-filter'></i>
											Filters
										</button>
									</div>

									{/* Advanced Filters Panel - Users */}
									{showFilters && (
										<div className='mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
											<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
												{/* Relationship Filter */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Relationship
													</label>
													<select
														value={filters.relationship}
														onChange={(e) =>
															setFilters({
																...filters,
																relationship: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'>
														<option value='all'>All Relationships</option>
														<option value='executor'>Executor</option>
														<option value='trustee'>Trustee</option>
														<option value='administrator'>Administrator</option>
														<option value='beneficiary'>Beneficiary</option>
														<option value='attorney'>Attorney</option>
														<option value='real-estate-agent'>
															Real Estate Agent
														</option>
														<option value='other'>Other</option>
													</select>
												</div>

												{/* Date Range */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Registered After
													</label>
													<input
														type='date'
														value={filters.startDate}
														onChange={(e) =>
															setFilters({
																...filters,
																startDate: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal leading-3'
													/>
												</div>

												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Registered Before
													</label>
													<input
														type='date'
														value={filters.endDate}
														onChange={(e) =>
															setFilters({
																...filters,
																endDate: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal leading-3'
													/>
												</div>

												{/* Sort Options */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Sort By
													</label>
													<select
														value={filters.sortBy}
														onChange={(e) =>
															setFilters({ ...filters, sortBy: e.target.value })
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'>
														<option value='createdAt'>Registration Date</option>
														<option value='name'>Name</option>
														<option value='submissionCount'>
															Submission Count
														</option>
														<option value='lastAccessedAt'>Last Active</option>
													</select>
												</div>

												{/* Sort Order */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Order
													</label>
													<select
														value={filters.sortOrder}
														onChange={(e) =>
															setFilters({
																...filters,
																sortOrder: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorTeal'>
														<option value='desc'>Descending</option>
														<option value='asc'>Ascending</option>
													</select>
												</div>
											</div>

											{/* Filter Action Buttons */}
											<div className='flex gap-3 mt-4'>
												<button
													onClick={() => {
														setCurrentPage(1);
														setShowFilters(false);
													}}
													className='bg-colorTeal text-white px-6 py-2 rounded-lg hover:bg-[#007a87] transition-colors font-semibold flex items-center gap-2'>
													<i className='fas fa-check'></i>
													Apply Filters
												</button>
												<button
													onClick={() => {
														setFilters({
															relationship: "all",
															startDate: "",
															endDate: "",
															minScore: "",
															maxScore: "",
															sortBy: "createdAt",
															sortOrder: "desc",
														});
														setSearchTerm("");
														setInputValue("");
														setCurrentPage(1);
													}}
													className='bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2'>
													<i className='fas fa-times'></i>
													Clear All
												</button>
											</div>
										</div>
									)}

									<div className='mt-2 flex items-center gap-2'>
										{isSearching && (
											<span className='text-sm text-colorTeal font-medium animate-pulse'>
												<i className='fas fa-sync fa-spin mr-1'></i>
												Searching...
											</span>
										)}
										{!isSearching && !loadingUsers && (
											<p className='text-sm text-gray-600'>
												{searchTerm
													? `Found ${users.length} user${
															users.length !== 1 ? "s" : ""
													  } matching "${searchTerm}"`
													: `Showing ${users.length} user${
															users.length !== 1 ? "s" : ""
													  }`}
											</p>
										)}
									</div>
								</div>
							</>
						)}

						{/* Search and Filters - Submissions Tab */}
						{defaultTab === "submissions" && (
							<>
								<div className='mb-6'>
									<div className='flex gap-2 items-center'>
										<div className='relative flex-1'>
											<input
												type='text'
												placeholder='Search by user name or email...'
												value={inputValue}
												onChange={(e) => setInputValue(e.target.value)}
												onBlur={() => {
													setSearchTerm(inputValue);
													setCurrentPage(1);
												}}
												onKeyDown={(e) => {
													if (e.key === "Enter") {
														setSearchTerm(inputValue);
														setCurrentPage(1);
													}
												}}
												className='w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange transition-colors'
											/>
											<i className='fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
											{isSearching && (
												<i className='fas fa-spinner fa-spin absolute right-4 top-1/2 transform -translate-y-1/2 text-colorOrange'></i>
											)}
										</div>
										<button
											onClick={() => setShowFilters(!showFilters)}
											className={`px-4 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
												showFilters
													? "bg-colorOrange text-white"
													: "bg-gray-200 text-gray-700 hover:bg-gray-300"
											}`}>
											<i className='fas fa-filter'></i>
											Filters
										</button>
									</div>

									{/* Advanced Filters Panel - Submissions */}
									{showFilters && (
										<div className='mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg'>
											<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
												{/* Score Range */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Min Score (%)
													</label>
													<input
														type='number'
														placeholder='0'
														min='0'
														max='100'
														value={filters.minScore}
														onChange={(e) =>
															setFilters({
																...filters,
																minScore: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange'
													/>
												</div>

												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Max Score (%)
													</label>
													<input
														type='number'
														placeholder='100'
														min='0'
														max='100'
														value={filters.maxScore}
														onChange={(e) =>
															setFilters({
																...filters,
																maxScore: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange'
													/>
												</div>

												{/* Date Range */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Submitted After
													</label>
													<input
														type='date'
														value={filters.startDate}
														onChange={(e) =>
															setFilters({
																...filters,
																startDate: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange leading-3'
													/>
												</div>

												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Submitted Before
													</label>
													<input
														type='date'
														value={filters.endDate}
														onChange={(e) =>
															setFilters({
																...filters,
																endDate: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange leading-3'
													/>
												</div>

												{/* Sort Options */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Sort By
													</label>
													<select
														value={filters.sortBy}
														onChange={(e) =>
															setFilters({ ...filters, sortBy: e.target.value })
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange'>
														<option value='submittedAt'>Submission Date</option>
														<option value='percentage'>Score</option>
														<option value='userName'>User Name</option>
													</select>
												</div>

												{/* Sort Order */}
												<div>
													<label className='block text-sm font-semibold text-gray-700 mb-1'>
														Order
													</label>
													<select
														value={filters.sortOrder}
														onChange={(e) =>
															setFilters({
																...filters,
																sortOrder: e.target.value,
															})
														}
														className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-colorOrange'>
														<option value='desc'>Descending</option>
														<option value='asc'>Ascending</option>
													</select>
												</div>
											</div>

											{/* Filter Action Buttons */}
											<div className='flex gap-3 mt-4'>
												<button
													onClick={() => {
														setCurrentPage(1);
														setShowFilters(false);
													}}
													className='bg-colorOrange text-white px-6 py-2 rounded-lg hover:bg-[#E66902] transition-colors font-semibold flex items-center gap-2'>
													<i className='fas fa-check'></i>
													Apply Filters
												</button>
												<button
													onClick={() => {
														setFilters({
															relationship: "all",
															startDate: "",
															endDate: "",
															minScore: "",
															maxScore: "",
															sortBy: "createdAt",
															sortOrder: "desc",
														});
														setSearchTerm("");
														setInputValue("");
														setCurrentPage(1);
													}}
													className='bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center gap-2'>
													<i className='fas fa-times'></i>
													Clear All
												</button>
											</div>
										</div>
									)}

									<div className='mt-2 flex items-center gap-2'>
										{isSearching && (
											<span className='text-sm text-colorOrange font-medium animate-pulse'>
												<i className='fas fa-sync fa-spin mr-1'></i>
												Searching...
											</span>
										)}
										{!isSearching && !loadingSubmissions && (
											<p className='text-sm text-gray-600'>
												{searchTerm
													? `Found ${submissions.length} submission${
															submissions.length !== 1 ? "s" : ""
													  } matching "${searchTerm}"`
													: `Showing ${submissions.length} submission${
															submissions.length !== 1 ? "s" : ""
													  }`}
											</p>
										)}
									</div>
								</div>
							</>
						)}

						{/* Content */}
						{defaultTab === "users" && loadingUsers ? (
							<div className='text-center py-12'>
								<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097A7]'></div>
								<p className='mt-4 text-gray-600'>Loading users...</p>
							</div>
						) : defaultTab === "submissions" && loadingSubmissions ? (
							<div className='text-center py-12'>
								<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD7702]'></div>
								<p className='mt-4 text-gray-600'>Loading submissions...</p>
							</div>
						) : (
							<>
								{defaultTab === "users" && (
									<div className='overflow-x-auto animate-fade-in'>
										<table className='w-full border-collapse'>
											<thead className='bg-gray-50'>
												<tr>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Name
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Email
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Phone
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Relationship
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Submissions
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Last Score
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Registered
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Actions
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{users.map((user) => (
													<tr key={user._id} className='hover:bg-gray-50'>
														<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
															{user.name}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{user.email}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{user.phone}
														</td>
														<td className='px-6 py-4 whitespace-nowrap'>
															<span className='px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize'>
																{user.relationship.replace("-", " ")}
															</span>
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{user.submissionCount}
														</td>
														<td className='px-6 py-4 whitespace-nowrap'>
															{user.lastSubmission ? (
																<span
																	className={`px-2 py-1 text-xs font-semibold rounded-full border ${getReadinessBadgeColor(
																		user.lastSubmission.percentage,
																	)}`}>
																	{user.lastSubmission.percentage}%
																</span>
															) : (
																<span className='text-gray-400 text-sm'>
																	No submissions
																</span>
															)}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{formatDate(user.createdAt)}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
															<div className='flex items-center gap-3'>
																{user.submissionCount > 0 ? (
																	<Link
																		to={`/management/quiz-submissions?user=${user._id}`}
																		className='text-[#0097A7] hover:text-[#007A87] transition-colors flex items-center gap-1 font-semibold'>
																		<i className='fas fa-clipboard-list'></i>
																		View Submission
																	</Link>
																) : (
																	<span className='text-gray-400 text-sm italic'>
																		No submission
																	</span>
																)}
																<button
																	onClick={() => deleteUser(user._id)}
																	disabled={deletingId === user._id}
																	className='text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
																	{deletingId === user._id ? (
																		<i className='fas fa-spinner fa-spin'></i>
																	) : (
																		<i className='fas fa-trash-alt'></i>
																	)}
																	Delete
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
										{users.length === 0 && (
											<div className='text-center py-16'>
												<i className='fas fa-users text-6xl text-gray-300 mb-4'></i>
												<p className='text-xl text-gray-500 font-semibold'>
													No users found
												</p>
												<p className='text-gray-400 mt-2'>
													{searchTerm ||
													filters.relationship !== "all" ||
													filters.startDate ||
													filters.endDate
														? "Try adjusting your search filters"
														: "Users will appear here once they complete the quiz"}
												</p>
											</div>
										)}
									</div>
								)}

								{defaultTab === "submissions" && (
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-50'>
												<tr>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														User
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Email
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Score
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Tier
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Submitted
													</th>
													<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
														Actions
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{submissions.map((submission) => (
													<tr key={submission._id} className='hover:bg-gray-50'>
														<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
															{submission.userId?.name || "Unknown"}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{submission.userId?.email || "N/A"}
														</td>
														<td className='px-6 py-4 whitespace-nowrap'>
															<span
																className={`px-2 py-1 text-xs font-semibold rounded-full border ${getReadinessBadgeColor(
																	submission.results.percentage,
																)}`}>
																{submission.results.percentage}%
															</span>
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{submission.results.band.tier}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
															{formatDate(submission.submittedAt)}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
															<div className='flex items-center gap-3'>
																<button
																	onClick={() =>
																		viewSubmissionDetail(submission._id)
																	}
																	className='text-[#0097A7] hover:text-[#007A87] transition-colors flex items-center gap-1 font-semibold'>
																	<i className='fas fa-eye mr-1'></i>
																	View
																</button>
																<button
																	onClick={() =>
																		deleteSubmission(submission._id)
																	}
																	disabled={deletingId === submission._id}
																	className='text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed'>
																	{deletingId === submission._id ? (
																		<i className='fas fa-spinner fa-spin mr-1'></i>
																	) : (
																		<i className='fas fa-trash-alt mr-1'></i>
																	)}
																	Delete
																</button>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
										{submissions.length === 0 && (
											<div className='text-center py-16'>
												<i className='fas fa-clipboard-check text-6xl text-gray-300 mb-4'></i>
												<p className='text-xl text-gray-500 font-semibold'>
													No submissions found
												</p>
												<p className='text-gray-400 mt-2'>
													{searchTerm
														? "Try adjusting your search query"
														: "Quiz submissions will appear here once users complete the quiz"}
												</p>
											</div>
										)}
									</div>
								)}

								{/* Pagination */}
								{totalPages > 1 && (
									<div className='mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 gap-4'>
										<div className='text-sm text-gray-700'>
											Showing page{" "}
											<span className='font-semibold'>{currentPage}</span> of{" "}
											<span className='font-semibold'>{totalPages}</span>
										</div>
										<div className='flex gap-2'>
											<button
												onClick={() =>
													setCurrentPage((prev) => Math.max(1, prev - 1))
												}
												disabled={currentPage === 1}
												className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'>
												<i className='fas fa-chevron-left'></i>
												Previous
											</button>
											<button
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(totalPages, prev + 1),
													)
												}
												disabled={currentPage === totalPages}
												className='px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2'>
												Next
												<i className='fas fa-chevron-right'></i>
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</div>

				{/* Submission Detail Modal */}
				{selectedSubmission && (
					<div className='fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4'>
						<div className='bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
							<div className='bg-gradient-to-r from-[#0097A7] to-[#007A87] text-white p-6 rounded-t-xl'>
								<div className='flex justify-between items-start'>
									<div>
										<h2 className='text-2xl font-bold flex items-center gap-2'>
											<i className='fas fa-user-circle'></i>
											{selectedSubmission.userId?.name || "Unknown User"} -
											Submission Details
										</h2>
										<p className='text-sm text-white/90 mt-1 flex items-center gap-2'>
											<i className='fas fa-envelope'></i>
											{selectedSubmission.userId?.email || "N/A"}
										</p>
									</div>
									<button
										onClick={() => setSelectedSubmission(null)}
										className='text-white/80 hover:text-white transition-colors'>
										<i className='fas fa-times text-2xl'></i>
									</button>
								</div>
							</div>
							<div className='p-6'>
								{loadingSubmissionDetail ? (
									<div className='text-center py-12'>
										<div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0097A7]'></div>
										<p className='mt-4 text-gray-600'>
											Loading submission details...
										</p>
									</div>
								) : selectedSubmission?.results ? (
									<div className='space-y-6'>
										{/* Submission Header with Date */}
										<div className='flex items-center justify-between pb-4 border-b border-gray-200'>
											<h3 className='text-lg font-semibold text-gray-700'>
												Submitted on{" "}
												{formatDate(selectedSubmission.submittedAt)}
											</h3>
										</div>

										{/* Readiness Tier Section */}
										<div className='bg-gray-50 rounded-xl p-6 border border-gray-100'>
											<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
												<div>
													<p className='text-sm uppercase tracking-[0.25em] text-gray-500'>
														Readiness Tier
													</p>
													<h2 className='text-3xl font-black text-[#0097A7]'>
														{selectedSubmission.results.band.label}
													</h2>
													<p className='text-gray-600 mt-3 max-w-2xl leading-normal'>
														{selectedSubmission.results.band.message}
													</p>
												</div>
												<div className='bg-white border border-[#0097A7]/30 rounded-lg p-4 text-center min-w-[240px]'>
													<p className='text-xs uppercase text-[#0097A7] tracking-wide'>
														Readiness Score
													</p>
													<p className='text-5xl font-black text-[#0097A7]'>
														{selectedSubmission.results.percentage}%
													</p>
													<p className='text-xs text-gray-500 mt-2'>
														{selectedSubmission.results.totalPoints} / 100
														execution points achieved
													</p>
												</div>
											</div>
										</div>

										{/* Questions and Answers Section */}
										<div className='bg-white border border-gray-100 rounded-xl p-6 shadow-sm'>
											<h3 className='text-lg font-bold text-[#0097A7] mb-4'>
												<i className='fas fa-clipboard-check mr-2'></i>
												Questions & Responses
											</h3>
											<div className='space-y-3'>
												{questions.map((q, index) => {
													const answerPoints = selectedSubmission.answers[q.id];
													const answerInfo = getAnswerLabel(
														answerPoints,
														q.isOccupancyQuestion,
													);
													return (
														<div
															key={q.id}
															className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200'>
															<div className='flex-shrink-0 w-8 h-8 bg-[#0097A7] text-white rounded-full flex items-center justify-center font-bold text-sm'>
																{index + 1}
															</div>
															<div className='flex-grow'>
																<p className='font-semibold text-gray-800 text-sm'>
																	{q.question}
																</p>
																<div className='mt-2'>
																	<span
																		className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${answerInfo.bgColor} ${answerInfo.color} border border-current`}>
																		{answerInfo.label}
																	</span>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>

										{/* Blocked Items & Strategic Recommendations */}
										<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
											<div className='bg-white border border-gray-100 rounded-xl p-6 shadow-sm'>
												<h3 className='text-lg font-bold text-[#0097A7] mb-3'>
													Blocked Items & Action Steps
												</h3>
												<div className='space-y-4'>
													{selectedSubmission.results.missingItems.length >
														0 && (
														<div>
															<p className='text-sm font-semibold text-red-600 uppercase tracking-wide mb-2'>
																Blocked (NO)
															</p>
															<div className='space-y-3'>
																{questions
																	.filter(
																		(q) =>
																			selectedSubmission.answers[q.id] === 0,
																	)
																	.map((q) => (
																		<div
																			key={q.id}
																			className='bg-red-50 border-l-4 border-red-500 p-3 rounded'>
																			<p className='font-semibold text-sm text-gray-800'>
																				{q.question}
																			</p>
																			<p className='text-xs text-gray-600 mt-1'>
																				{q.recommendation}
																			</p>
																		</div>
																	))}
															</div>
														</div>
													)}
													{selectedSubmission.results.partialItems.length >
														0 && (
														<div>
															<p className='text-sm font-semibold text-[#FD7702] uppercase tracking-wide mb-2'>
																In Progress
															</p>
															<div className='space-y-3'>
																{questions
																	.filter(
																		(q) =>
																			selectedSubmission.answers[q.id] === 5,
																	)
																	.map((q) => (
																		<div
																			key={q.id}
																			className='bg-orange-50 border-l-4 border-[#FD7702] p-3 rounded'>
																			<p className='font-semibold text-sm text-gray-800'>
																				{q.question}
																			</p>
																			<p className='text-xs text-gray-600 mt-1'>
																				{q.recommendation}
																			</p>
																		</div>
																	))}
															</div>
														</div>
													)}
													{selectedSubmission.results.completeItems.length >
														0 && (
														<div>
															<p className='text-sm font-semibold text-[#0097A7] uppercase tracking-wide mb-2'>
																Completed
															</p>
															<ul className='list-disc list-inside text-gray-700 space-y-1 text-sm'>
																{selectedSubmission.results.completeItems.map(
																	(item, idx) => (
																		<li key={idx}>{item}</li>
																	),
																)}
															</ul>
														</div>
													)}
													{selectedSubmission.results.missingItems.length ===
														0 &&
														selectedSubmission.results.partialItems.length ===
															0 &&
														selectedSubmission.results.completeItems.length ===
															0 && (
															<p className='text-sm text-gray-600'>
																No items to display.
															</p>
														)}
												</div>
											</div>
											<div className='bg-white border border-gray-100 rounded-xl p-6 shadow-sm'>
												<h3 className='text-lg font-bold text-[#0097A7] mb-3'>
													Strategic Recommendations
												</h3>
												<ul className='list-disc list-inside space-y-2 text-gray-700 text-sm'>
													{selectedSubmission.results.recommendations.map(
														(rec, idx) => (
															<li key={idx}>{rec}</li>
														),
													)}
												</ul>
												{selectedSubmission.results.strategicFocus &&
													selectedSubmission.results.strategicFocus.length >
														0 && (
														<div className='mt-4 border-t border-gray-100 pt-4'>
															<p className='text-sm font-semibold text-[#FD7702] uppercase tracking-wide'>
																Focus Signals
															</p>
															<ul className='list-disc list-inside text-gray-700 text-sm mt-2 space-y-1'>
																{selectedSubmission.results.strategicFocus.map(
																	(focus, idx) => (
																		<li key={idx}>{focus}</li>
																	),
																)}
															</ul>
														</div>
													)}
											</div>
										</div>

										{/* AI Chat Interface */}
										<AiChatInterface
											contextData={selectedSubmission.results}
											contextLabel='Executor Readiness Assessment'
										/>

										{/* Capability Radar */}
										<div className='bg-gray-50 border border-gray-100 rounded-xl p-6'>
											<h3 className='text-lg font-bold text-[#0097A7] mb-4'>
												Capability Radar
											</h3>
											<div className='space-y-4'>
												{groupScores.map((score) => (
													<div key={score.groupId}>
														<div className='flex items-center justify-between text-sm font-semibold text-gray-600 mb-1'>
															<span>{score.label}</span>
															<span>{score.percent}%</span>
														</div>
														<div className='h-3 bg-gray-200 rounded-full overflow-hidden'>
															<div
																className='h-full bg-gradient-to-r from-[#0097A7] to-[#007A87]'
																style={{ width: `${score.percent}%` }}
															/>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								) : (
									<div className='text-center py-12'>
										<i className='fas fa-exclamation-circle text-4xl text-gray-400 mb-4'></i>
										<p className='text-gray-600'>
											No submission data available.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default QuizManagement;
