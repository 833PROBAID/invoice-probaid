import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../Shared/Loading";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import Swal from "sweetalert2";
import { database } from "../Shared/firebaseConfig";
import Seo from "../Components/SEO";

const AllBlogList = () => {
	const [blogs, setBlogs] = useState([]);
	const [filteredBlogs, setFilteredBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const blogsPerPage = 9;

	const fetchBlogs = async () => {
		try {
			setLoading(true);
			const blogsRef = ref(database, "blogsDev");
			const publishedBlogsQuery = query(
				blogsRef,
				orderByChild("status"),
				equalTo("published"),
			);

			const snapshot = await get(publishedBlogsQuery);
			const data = snapshot.val();
			const loadedBlogs = [];
			const uniqueCategories = new Set();

			if (data) {
				for (const id in data) {
					const wordCount = data[id].content
						? countWords(data[id].content)
						: 200;
					const readingTime = Math.ceil(wordCount / 200);

					loadedBlogs.push({
						id,
						...data[id],
						readingTime,
						timestamp: data[id].timestamp || new Date(data[id].date).getTime(),
					});

					if (data[id].category) {
						uniqueCategories.add(data[id].category);
					}
				}
			}

			setBlogs(loadedBlogs);
			setFilteredBlogs(loadedBlogs);
		} catch (error) {
			console.error("Error fetching blogs:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to load blogs. Please try again later.",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBlogs();
	}, []);

	useEffect(() => {
		filterAndSortBlogs();
	}, [blogs, searchTerm]);

	const countWords = (text) => {
		return text.trim().split(/\s+/).length;
	};

	const filterAndSortBlogs = () => {
		let filtered = [...blogs];

		if (searchTerm) {
			filtered = filtered.filter(
				(blog) =>
					blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
					blog.content?.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		setFilteredBlogs(filtered);
		setCurrentPage(1);
	};

	const indexOfLastBlog = currentPage * blogsPerPage;
	const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
	const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
	const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<Seo
				title='Our Blog Posts'
				description='Read the latest articles and updates from 833Probate'
				pathname='/blogs'
			/>

			<div className='relative max-w-7xl mx-auto px-3 py-4 sm:px-4 md:px-6 lg:px-8 lg:py-10 overflow-hidden'>
				<div className='absolute top-0 left-0 w-64 h-64 bg-colorTeal/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl'></div>
				<div className='absolute bottom-0 right-0 w-96 h-96 bg-colorOrange/5 rounded-full translate-x-1/2 translate-y-1/3 blur-3xl'></div>

				<div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 relative z-10'>
					<div className='text-center max-w-3xl mx-auto'>
						<h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4 relative'>
							<span className='inline-block relative'>
								Latest
								<span className='absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 bg-colorTeal rounded-full transform scale-x-75'></span>
							</span>{" "}
							<span className='text-colorTeal'>Blogs</span> & Resources
						</h1>
						<p className='text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-10 leading-relaxed px-2 sm:px-0'>
							Explore our collection of expert Blogs and guides to help you
							navigate the probate process with confidence.
						</p>
					</div>

					<div className='max-w-3xl mx-auto relative'>
						<div className='bg-white shadow-lg rounded-full p-1 flex items-center border border-gray-100 transition-shadow focus-within:shadow-xl'>
							<div className='pl-3 sm:pl-5 pr-2 sm:pr-3 text-colorTeal'>
								<i className='fas fa-search text-base sm:text-lg'></i>
							</div>
							<input
								type='text'
								placeholder='Search articles...'
								className='w-full py-2 sm:py-3 px-1 sm:px-2 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm sm:text-base'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							{searchTerm && (
								<button
									onClick={() => setSearchTerm("")}
									className='mr-1 sm:mr-2 p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors'>
									<i className='fas fa-times-circle'></i>
								</button>
							)}
							<button className='bg-colorTeal text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-full hover:bg-colorTeal/90 transition-colors duration-300 shadow-md text-sm sm:text-base'>
								Search
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6'>
				{filteredBlogs.length === 0 ? (
					<div className='text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100 mx-2 sm:mx-0'>
						<div className='w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center bg-gray-100 rounded-full mb-4 sm:mb-6'>
							<i className='fas fa-search text-colorTeal text-2xl sm:text-3xl'></i>
						</div>
						<h3 className='text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3'>
							No articles found
						</h3>
						<p className='text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 px-4 sm:px-0 text-sm sm:text-base'>
							We couldn't find any articles matching your current filters. Try
							adjusting your search criteria.
						</p>
						<button
							onClick={() => {
								setSearchTerm("");
							}}
							className='inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-colorTeal text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-colorOrange text-sm sm:text-base'>
							<i className='fas fa-sync-alt mr-2'></i> Reset All Filters
						</button>
					</div>
				) : (
					<>
						<div className='flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8'>
							<p className='text-xs sm:text-sm text-gray-600 mb-4 sm:mb-0 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-gray-100'>
								Showing{" "}
								<span className='font-semibold text-colorTeal'>
									{indexOfFirstBlog + 1}-
									{Math.min(indexOfLastBlog, filteredBlogs.length)}
								</span>{" "}
								of{" "}
								<span className='font-semibold text-colorTeal'>
									{filteredBlogs.length}
								</span>{" "}
								articles
							</p>

							{totalPages > 1 && (
								<div className='inline-flex rounded-lg shadow-sm overflow-hidden'>
									<button
										onClick={() =>
											setCurrentPage((prev) => Math.max(prev - 1, 1))
										}
										disabled={currentPage === 1}
										className={`px-3 sm:px-4 py-1.5 sm:py-2 border text-sm ${
											currentPage === 1
												? "bg-gray-100 text-gray-400 cursor-not-allowed"
												: "bg-white text-colorTeal hover:bg-gray-50"
										} border-r-0`}>
										<i className='fas fa-chevron-left'></i>
									</button>

									{[...Array(totalPages)].map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentPage(index + 1)}
											className={`hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 border text-sm ${
												currentPage === index + 1
													? "bg-colorTeal text-white font-medium border-colorTeal"
													: "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
											} ${
												index === totalPages - 1 ? "rounded-r-lg border-r" : ""
											}`}>
											{index + 1}
										</button>
									))}

									<button
										onClick={() =>
											setCurrentPage((prev) => Math.min(prev + 1, totalPages))
										}
										disabled={currentPage === totalPages}
										className={`px-3 sm:px-4 py-1.5 sm:py-2 border text-sm ${
											currentPage === totalPages
												? "bg-gray-100 text-gray-400 cursor-not-allowed"
												: "bg-white text-colorTeal hover:bg-gray-50"
										}`}>
										<i className='fas fa-chevron-right'></i>
									</button>
								</div>
							)}
						</div>

						<div className='grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
							{currentBlogs.map((blog) => (
								<div key={blog.id} className='group'>
									{blog?.type === "auto" ? (
										<Preview url={blog.link} />
									) : (
										<div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 h-full flex flex-col hover:shadow-xl transform hover:-translate-y-1'>
											<div className='relative overflow-hidden'>
												<img
													src={blog.imageUrl || "/blog_default.jpg"}
													alt={blog.title}
													className='w-full h-48 sm:h-56 object-cover transition-transform duration-700 group-hover:scale-105'
												/>
												<div className='absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60'></div>

												{blog.category && (
													<span className='absolute top-2 sm:top-3 right-2 sm:right-3 bg-colorTeal text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wide shadow-md'>
														{blog.category}
													</span>
												)}
												<div className='absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 shadow-md'>
													<div className='text-colorTeal text-xs font-bold'>
														{new Date(blog.date).toLocaleDateString("en-US", {
															month: "short",
															day: "numeric",
															year: "numeric",
														})}
													</div>
												</div>

												<div className='absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center text-white text-xs bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full'>
													<i className='fas fa-clock mr-1'></i>
													<span>{blog.readingTime} min read</span>
												</div>
											</div>

											<div className='p-4 sm:p-6 flex-grow flex flex-col'>
												<h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 line-clamp-2 group-hover:text-colorTeal transition-colors duration-300'>
													{blog.title}
												</h2>
												<p className='text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4'>
													<i className='fas fa-user-edit mr-1'></i>{" "}
													<span className='font-medium'>{blog.author}</span>
												</p>

												{blog.description && (
													<p className='text-gray-600 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow'>
														{blog.description}
													</p>
												)}

												<div className='flex justify-between items-center mt-auto pt-3 sm:pt-4 border-t border-gray-100'>
													<Link
														to={`/blog/${blog.id}`}
														className='inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-colorTeal text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-300 hover:bg-colorOrange hover:shadow-md'>
														Read Article{" "}
														<i className='fas fa-arrow-right ml-2'></i>
													</Link>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						{totalPages > 1 && (
							<div className='flex justify-center mt-6 sm:mt-10'>
								<nav className='flex items-center gap-1'>
									<button
										onClick={() =>
											setCurrentPage((prev) => Math.max(prev - 1, 1))
										}
										disabled={currentPage === 1}
										className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-l-lg text-sm ${
											currentPage === 1
												? "bg-gray-100 text-gray-400 cursor-not-allowed"
												: "bg-white text-colorTeal border border-gray-200"
										}`}>
										<i className='fas fa-chevron-left'></i>
									</button>

									<span className='px-3 sm:px-4 py-1.5 sm:py-2 bg-white text-gray-700 border-t border-b border-gray-200 text-sm'>
										Page {currentPage} of {totalPages}
									</span>

									<button
										onClick={() =>
											setCurrentPage((prev) => Math.min(prev + 1, totalPages))
										}
										disabled={currentPage === totalPages}
										className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-r-lg text-sm ${
											currentPage === totalPages
												? "bg-gray-100 text-gray-400 cursor-not-allowed"
												: "bg-white text-colorTeal border border-gray-200"
										}`}>
										<i className='fas fa-chevron-right'></i>
									</button>
								</nav>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default AllBlogList;

const Preview = ({ url }) => {
	const [preview, setPreview] = useState(null);
	const [loadError, setLoadError] = useState(false);

	const fetchLinkPreview = async (url) => {
		try {
			const response = await fetch(
				`https://api.microlink.io/?url=${encodeURIComponent(url)}`,
			);
			const data = await response.json();

			if (data.status === "success") {
				setPreview(data.data);
			} else {
				console.error("Preview fetch failed:", data);
				setLoadError(true);
			}
		} catch (error) {
			console.error("Error fetching link preview:", error);
			setLoadError(true);
		}
	};

	useEffect(() => {
		if (url) {
			fetchLinkPreview(url);
		}
	}, [url]);

	if (loadError) {
		return (
			<div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col'>
				<div className='p-6 flex-grow flex flex-col justify-center items-center text-center'>
					<i className='fas fa-link text-4xl text-gray-300 mb-4'></i>
					<h3 className='text-xl font-semibold text-gray-700 mb-2'>
						Link Preview Unavailable
					</h3>
					<p className='text-gray-500 mb-4'>
						We couldn't load a preview for this link.
					</p>
					<a
						href={url}
						target='_blank'
						rel='noreferrer'
						className='inline-block px-4 py-2 bg-colorTeal text-white font-semibold rounded-lg shadow-md transition-colors duration-300 hover:bg-colorOrange'>
						Visit Original Link
					</a>
				</div>
			</div>
		);
	}

	if (!preview) {
		return (
			<div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full'>
				<div className='animate-pulse'>
					<div className='w-full h-56 bg-gray-200'></div>
					<div className='p-6'>
						<div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
						<div className='h-4 bg-gray-200 rounded w-1/2 mb-6'></div>
						<div className='h-20 bg-gray-200 rounded mb-6'></div>
						<div className='h-10 bg-gray-200 rounded w-1/3'></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 h-full flex flex-col hover:shadow-xl transform hover:-translate-y-1'>
			<div className='relative overflow-hidden'>
				<img
					src={preview.image?.url || "/blog_default.jpg"}
					alt={preview.title}
					className='w-full h-48 sm:h-56 object-cover transition-transform duration-700 group-hover:scale-105'
					onError={(e) => {
						e.target.src = "/blog_default.jpg";
					}}
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70'></div>

				<div className='absolute top-2 sm:top-3 right-2 sm:right-3 bg-colorOrange text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wide shadow-md'>
					External
				</div>

				{preview.publisher && (
					<div className='absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full flex items-center'>
						<i className='fas fa-globe mr-1'></i>
						<span className='line-clamp-1 max-w-[120px] sm:max-w-[150px]'>
							{preview.publisher}
						</span>
					</div>
				)}
			</div>

			<div className='p-4 sm:p-6 flex-grow flex flex-col'>
				<h2 className='text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 line-clamp-2 group-hover:text-colorTeal transition-colors duration-300'>
					{preview.title}
				</h2>
				{preview.author && (
					<p className='text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3'>
						<i className='fas fa-user-edit mr-1'></i>{" "}
						<span className='font-medium'>{preview.author}</span>
					</p>
				)}
				{preview.description && (
					<p className='text-gray-600 text-sm mb-4 sm:mb-5 line-clamp-3 flex-grow'>
						{preview.description}
					</p>
				)}

				<div className='flex justify-between items-center mt-auto pt-3 sm:pt-4 border-t border-gray-100'>
					<a
						href={preview.url}
						target='_blank'
						rel='noreferrer'
						className='inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-colorTeal text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-300 hover:bg-colorOrange hover:shadow-md'>
						Visit Article <i className='fas fa-external-link-alt ml-2'></i>
					</a>
				</div>
			</div>
		</div>
	);
};
