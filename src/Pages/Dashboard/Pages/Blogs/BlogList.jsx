import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ref, get, remove, update } from "firebase/database";
import { database } from "../../../../Shared/firebaseConfig";
import Loading from "../../../../Shared/Loading";
import useImageUpload from "../../../../hooks/useImageUpload";

const BlogList = () => {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const { deleteImage } = useImageUpload();
	const [filterStatus, setFilterStatus] = useState("all");

	const fetchBlogs = async () => {
		try {
			setLoading(true);
			const snapshot = await get(ref(database, "blogsDev"));
			const data = snapshot.val();
			const loadedBlogs = [];
			for (const customUrl in data) {
				loadedBlogs.push({
					id: customUrl,
					customUrl,
					...data[customUrl],
				});
			}
			setBlogs(loadedBlogs);
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

	const handleDelete = async (blog) => {
		const confirmDelete = await Swal.fire({
			title: "Are you sure you want to delete this blog?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		});

		if (confirmDelete.isConfirmed) {
			try {
				await remove(ref(database, `blogsDev/${blog.id}`));

				if (blog.imageUrl) {
					await deleteImage(blog.imageUrl);
				}

				fetchBlogs();
				Swal.fire({
					icon: "success",
					title: "Blog Deleted",
					text: "The blog has been successfully deleted.",
				});
			} catch (error) {
				console.error("Error deleting blog:", error);
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Failed to delete blog. Please try again later.",
				});
			}
		}
	};

	const handleStatusChange = async (blog, newStatus) => {
		const action = newStatus === "published" ? "publish" : "unpublish";
		const confirmChange = await Swal.fire({
			title: `Are you sure you want to ${action} this blog?`,
			text:
				newStatus === "published"
					? "The blog will be visible to all users."
					: "The blog will be hidden from users.",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: newStatus === "published" ? "#10b981" : "#f59e0b",
			cancelButtonColor: "#6b7280",
			confirmButtonText:
				newStatus === "published" ? "Yes, publish it!" : "Yes, unpublish it!",
		});

		if (confirmChange.isConfirmed) {
			try {
				setLoading(true);
				// Update the blog status in Firebase
				await update(ref(database, `blogsDev/${blog.id}`), {
					status: newStatus,
				});

				fetchBlogs();

				Swal.fire({
					icon: "success",
					title:
						newStatus === "published" ? "Blog Published" : "Blog Unpublished",
					text:
						newStatus === "published"
							? "The blog has been successfully published."
							: "The blog has been unpublished and is now in draft status.",
				});
			} catch (error) {
				console.error(`Error ${action}ing blog:`, error);
				Swal.fire({
					icon: "error",
					title: "Error",
					text: `Failed to ${action} blog. Please try again later.`,
				});
			} finally {
				setLoading(false);
			}
		}
	};

	const filteredBlogs =
		filterStatus === "all"
			? blogs
			: blogs.filter((blog) => blog.status === filterStatus);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className='bg-gray-100 dark:bg-darkBackground min-h-screen'>
			{/* Header with gradient */}
			<div className='bg-gradient-to-r from-colorTeal to-teal-500 shadow-lg'>
				<div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0'>
						<div>
							<h1 className='text-3xl font-bold text-white'>Blog Management</h1>
							<p className='mt-1 text-base text-white'>
								View, edit, and manage your blog content
							</p>
						</div>
						<Link to='/dashboard/addBlog'>
							<button className='inline-flex items-center px-4 py-2 border border-transparent bg-white text-sm font-medium rounded-md text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-teal-500 transition-all duration-200'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4 mr-2'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 4v16m8-8H4'
									/>
								</svg>
								Add New Blog
							</button>
						</Link>
					</div>
				</div>
			</div>

			{/* Content Area */}
			<div className='py-8'>
				<div className='bg-white dark:bg-darkBackground rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-8'>
					<div className='p-6'>
						<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0'>
							<div>
								<h2 className='text-xl font-semibold text-gray-900'>
									Your Blogs ({filteredBlogs.length})
								</h2>
								<p className='text-sm text-gray-600 mt-1'>
									Manage and organize your blog content
								</p>
							</div>

							<div className='flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-700 shadow-sm'>
								<button
									onClick={() => setFilterStatus("all")}
									className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
										filterStatus === "all"
											? "bg-colorTeal text-white shadow-sm"
											: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
									}`}>
									All
								</button>
								<button
									onClick={() => setFilterStatus("published")}
									className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
										filterStatus === "published"
											? "bg-colorTeal text-white shadow-sm"
											: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
									}`}>
									Published
								</button>
								<button
									onClick={() => setFilterStatus("draft")}
									className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
										filterStatus === "draft"
											? "bg-colorTeal text-white shadow-sm"
											: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
									}`}>
									Drafts
								</button>
							</div>
						</div>

						{filteredBlogs.length === 0 ? (
							<div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700'>
								<svg
									className='mx-auto h-12 w-12 text-gray-400'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
									/>
								</svg>
								<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-darkText'>
									No blogs found
								</h3>
								<p className='mt-1 text-sm text-gray-500 dark:text-darkText'>
									{filterStatus === "all"
										? "Get started by creating a new blog."
										: `No ${filterStatus} blogs found. Change your filter or add a new blog.`}
								</p>
								<div className='mt-6'>
									<Link to='/dashboard/addBlog'>
										<button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-colorTeal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal'>
											<svg
												className='-ml-1 mr-2 h-5 w-5'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M12 4v16m8-8H4'
												/>
											</svg>
											New Blog
										</button>
									</Link>
								</div>
							</div>
						) : (
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
									<thead className='bg-gray-50 dark:bg-gray-800'>
										<tr>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
												Blog
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
												Author
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
												Date
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
												Status
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
												Actions
											</th>
										</tr>
									</thead>
									<tbody className='bg-white dark:bg-darkBackground divide-y divide-gray-200 dark:divide-gray-700'>
										{filteredBlogs.map((blog) => (
											<tr
												key={blog.id}
												className='hover:bg-gray-50 dark:hover:bg-gray-800'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														<div className='flex-shrink-0 h-10 w-10'>
															{blog.imageUrl ? (
																<img
																	className='h-10 w-10 rounded-md object-cover'
																	src={blog.imageUrl}
																	alt={blog.title || "Blog image"}
																/>
															) : (
																<div className='h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
																	<svg
																		className='h-6 w-6 text-gray-400 dark:text-gray-500'
																		xmlns='http://www.w3.org/2000/svg'
																		fill='none'
																		viewBox='0 0 24 24'
																		stroke='currentColor'>
																		<path
																			strokeLinecap='round'
																			strokeLinejoin='round'
																			strokeWidth='2'
																			d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
																		/>
																	</svg>
																</div>
															)}
														</div>
														<div className='ml-4'>
															<div className='text-sm font-medium text-gray-900 dark:text-darkText'>
																{blog?.type === "auto" ? (
																	<a
																		href={blog.link}
																		className='text-colorTeal hover:underline'
																		target='_blank'
																		rel='noopener noreferrer'>
																		{blog.link}
																	</a>
																) : (
																	blog.title || "Untitled Blog"
																)}
															</div>
															<div className='text-sm text-gray-500 dark:text-gray-400'>
																{blog.customUrl ? (
																	<span>URL: {blog.customUrl}</span>
																) : (
																	<span>ID: {blog.id}</span>
																)}
															</div>
														</div>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900 dark:text-darkText'>
														{blog.author || "-"}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900 dark:text-darkText'>
														{blog.date || "-"}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<span
														className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
															blog.status === "published"
																? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
																: "bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900"
														}`}>
														{blog.status === "published"
															? "Published"
															: "Draft"}
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
													<div className='flex space-x-3'>
														<Link
															to={`/dashboard/blog/${blog.id}`}
															className='text-colorTeal hover:text-teal-700'>
															<span className='flex items-center'>
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-5 w-5'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={2}
																		d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
																	/>
																</svg>
																<span className='ml-1 hidden sm:inline'>
																	Edit
																</span>
															</span>
														</Link>
														<button
															onClick={() => handleDelete(blog)}
															className='text-red-600 hover:text-red-800'>
															<span className='flex items-center'>
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-5 w-5'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={2}
																		d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
																	/>
																</svg>
																<span className='ml-1 hidden sm:inline'>
																	Delete
																</span>
															</span>
														</button>
														{blog.status === "draft" ? (
															<button
																onClick={() =>
																	handleStatusChange(blog, "published")
																}
																className='text-green-600 hover:text-green-800 transition-colors duration-200'>
																<span className='flex items-center'>
																	<svg
																		xmlns='http://www.w3.org/2000/svg'
																		className='h-5 w-5'
																		fill='none'
																		viewBox='0 0 24 24'
																		stroke='currentColor'>
																		<path
																			strokeLinecap='round'
																			strokeLinejoin='round'
																			strokeWidth={2}
																			d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
																		/>
																	</svg>
																	<span className='ml-1 hidden sm:inline'>
																		Publish
																	</span>
																</span>
															</button>
														) : (
															<button
																onClick={() =>
																	handleStatusChange(blog, "draft")
																}
																className='text-amber-600 hover:text-amber-800 transition-colors duration-200'>
																<span className='flex items-center'>
																	<svg
																		xmlns='http://www.w3.org/2000/svg'
																		className='h-5 w-5'
																		fill='none'
																		viewBox='0 0 24 24'
																		stroke='currentColor'>
																		<path
																			strokeLinecap='round'
																			strokeLinejoin='round'
																			strokeWidth={2}
																			d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
																		/>
																	</svg>
																	<span className='ml-1 hidden sm:inline'>
																		Unpublish
																	</span>
																</span>
															</button>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogList;
