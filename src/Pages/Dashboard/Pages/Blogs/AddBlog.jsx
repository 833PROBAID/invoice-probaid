import { useState } from "react";
import { Link } from "react-router-dom";
import { ref, set, get } from "firebase/database";
import Swal from "sweetalert2";
import { database } from "../../../../Shared/firebaseConfig";
import Loading from "../../../../Shared/Loading";
import useImageUpload from "../../../../hooks/useImageUpload";
import GrapesEditor from "../../../../components/GrapesEditor/GrapesEditor";

const AddBlog = () => {
	const [loading, setLoading] = useState(false);
	const [blog, setBlog] = useState({
		imageUrl: "",
		title: "",
		summary: "",
		author: "",
		date: "",
		customUrl: "",
		status: "draft", // Add default status as draft
	});
	const [outputHtml, setOutputHtml] = useState("<p>No content</p>");
	const [editorState, setEditorState] = useState(null);
	const { uploadImage, deleteImage, uploading } = useImageUpload();
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleRemoveImage = () => {
		setSelectedFile(null);
		setPreviewUrl(null);
		setBlog({ ...blog, imageUrl: "" });
	};

	const formatCustomUrl = (url) => {
		return url
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, "_")
			.replace(/-+/g, "_")
			.replace(/^-|-$/g, "");
	};

	const handleGetEditorContent = (content) => {
		console.log("Retrieved content from editor:", content);
		setOutputHtml(content.html);
		setEditorState(content.state);
	};

	const handleAddBlog = async (newBlog, status = "published") => {
		console.log("🚀 ~ handleAddBlog ~ newBlog:", newBlog);
		let uploadedImageUrl = "";
		try {
			setLoading(true);

			if (!newBlog.customUrl) {
				throw new Error("Custom URL is required");
			}
			const existingBlog = await get(
				ref(database, `blogsDev/${newBlog.customUrl}`),
			);
			if (existingBlog.exists()) {
				throw new Error("This custom URL is already in use");
			}

			if (selectedFile) {
				try {
					uploadedImageUrl = await uploadImage(selectedFile);
				} catch (uploadError) {
					throw new Error("Failed to upload image");
				}
			}

			await set(ref(database, `blogsDev/${newBlog.customUrl}`), {
				...newBlog,
				imageUrl: uploadedImageUrl,
				editorState: editorState,
				content: outputHtml,
				status: status,
			});

			Swal.fire({
				icon: "success",
				title: status === "published" ? "Blog Published" : "Draft Saved",
				text:
					status === "published"
						? "The blog has been successfully published."
						: "Your draft has been saved successfully.",
			}).then(() => {
				window.location.href = "/dashboard/blogs";
			});
		} catch (error) {
			if (uploadedImageUrl) {
				await deleteImage(uploadedImageUrl).catch(console.error);
			}
			console.error("Error adding blog:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text:
					error.message || "Failed to add new blog. Please try again later.",
			});
		} finally {
			setLoading(false);
		}
	};

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
							<h1 className='text-3xl font-bold text-white'>Add New Blog</h1>
							<p className='mt-1 text-base text-white'>
								Create engaging content for your audience
							</p>
						</div>
						<div className='flex gap-3'>
							<Link to='/dashboard/blogs'>
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
											d='M11 17l-5-5m0 0l5-5m-5 5h12'
										/>
									</svg>
									Back to Blogs
								</button>
							</Link>
							<button
								className='inline-flex items-center px-4 py-2 border border-transparent bg-white text-sm font-medium rounded-md text-teal-700 shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-teal-500 transition-all duration-200'
								onClick={() => {
									handleAddBlog(
										{
											...blog,
											summary: outputHtml,
											editorState: editorState,
											status: "published",
										},
										"published",
									);
								}}>
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
										d='M5 13l4 4L19 7'
									/>
								</svg>
								Publish
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Content Area */}
			<div className='py-8'>
				<div className='grid grid-cols-1 gap-8'>
					{/* Main Content */}
					<div className='bg-white dark:bg-darkBackground rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden'>
						{/* Blog Type Selector */}
						<div className='bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4'>
							<div className='flex items-center justify-between'>
								<h2 className='text-xl font-semibold text-gray-900 dark:text-darkText'>
									Blog Creation Method
								</h2>
								<div className='flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg p-1 border border-gray-300 dark:border-gray-600 shadow-sm'>
									<button
										onClick={() => setBlog({ ...blog, type: "manual" })}
										className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
											blog?.type === "manual" || !blog?.type
												? "bg-colorTeal text-white shadow-sm"
												: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
										}`}>
										<span className='flex items-center'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-4 w-4 mr-1.5'
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
											Manual
										</span>
									</button>
									<button
										onClick={() => setBlog({ ...blog, type: "auto" })}
										className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
											blog?.type === "auto"
												? "bg-colorTeal text-white shadow-sm"
												: "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
										}`}>
										<span className='flex items-center'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-4 w-4 mr-1.5'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
												/>
											</svg>
											Import
										</span>
									</button>
								</div>
							</div>
						</div>

						{/* Blog Form */}
						<div className='p-6'>
							{blog?.type === "auto" ? (
								<div className='bg-gradient-to-br from-blue-50 to-tealSoft dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-700 rounded-xl p-6'>
									<div className='flex items-center mb-4 text-blue-700'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5 mr-2'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
										<h3 className='text-lg font-medium'>Auto Import Blog</h3>
									</div>
									<div className='flex flex-col'>
										<label className='block text-base font-medium text-gray-800 mb-2'>
											Import URL
										</label>
										<div className='flex'>
											<div className='relative flex-grow'>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='h-5 w-5 text-gray-400'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
														/>
													</svg>
												</div>
												<input
													name='Link'
													value={blog?.link}
													onChange={(e) =>
														setBlog({ ...blog, link: e.target.value })
													}
													placeholder='https://example.com/article'
													className='block w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-l-lg focus:ring-2 focus:ring-colorTeal focus:border-colorTeal transition duration-150 text-base text-gray-900'
												/>
											</div>
											<button className='inline-flex items-center px-4 py-2 border border-transparent rounded-r-lg shadow-sm text-sm font-medium text-white bg-colorTeal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal transition-colors duration-200'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-5 w-5 mr-2'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
													/>
												</svg>
												Import
											</button>
										</div>
										<div className='mt-3 flex items-start'>
											<div className='flex-shrink-0'>
												<svg
													className='h-5 w-5 text-blue-400'
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 20 20'
													fill='currentColor'
													aria-hidden='true'>
													<path
														fillRule='evenodd'
														d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
														clipRule='evenodd'
													/>
												</svg>
											</div>
											<p className='ml-3 text-sm text-gray-700'>
												Enter a URL to import content automatically. Supports
												articles, blog posts, and news stories.
											</p>
										</div>
									</div>
								</div>
							) : (
								<div className='space-y-8'>
									{/* Title */}
									<div>
										<label className='block text-base font-medium text-gray-800 dark:text-darkText mb-2'>
											Blog Title
										</label>
										<div className='relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-5 w-5 text-gray-400'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
													/>
												</svg>
											</div>
											<input
												name='Title'
												value={blog?.title}
												onChange={(e) =>
													setBlog({ ...blog, title: e.target.value })
												}
												placeholder='Enter a compelling title'
												className='block w-full pl-10 py-3 border-2 border-gray-300 focus:ring-colorTeal focus:border-colorTeal rounded-md text-base text-gray-900'
											/>
										</div>
									</div>

									{/* Author and Date */}
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<div>
											<label className='block text-base font-medium text-gray-800 dark:text-darkText mb-2'>
												Author
											</label>
											<div className='relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='h-5 w-5 text-gray-400'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
														/>
													</svg>
												</div>
												<input
													name='Author'
													value={blog?.author}
													onChange={(e) =>
														setBlog({ ...blog, author: e.target.value })
													}
													placeholder='Author name'
													className='block w-full pl-10 py-3 border-2 border-gray-300 focus:ring-colorTeal focus:border-colorTeal rounded-md text-base text-gray-900'
												/>
											</div>
										</div>
										<div>
											<label className='block text-base font-medium text-gray-800 dark:text-darkText mb-2'>
												Publication Date
											</label>
											<div className='relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='h-5 w-5 text-gray-400'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
														/>
													</svg>
												</div>
												<input
													type='date'
													name='Date'
													value={blog?.date}
													onChange={(e) =>
														setBlog({ ...blog, date: e.target.value })
													}
													className='block w-full pl-10 pr-3 py-3 border-2 border-gray-300 focus:ring-colorTeal focus:border-colorTeal rounded-md text-base text-gray-900'
												/>
											</div>
										</div>
									</div>

									{/* Custom URL */}
									<div>
										<label className='block text-base font-medium text-gray-800 dark:text-darkText mb-2'>
											Custom URL
										</label>
										<div className='mt-1 flex rounded-md shadow-sm'>
											<span className='inline-flex items-center px-4 rounded-l-md border-2 border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-base font-medium'>
												domain.com/blogs/
											</span>
											<div className='relative flex-1'>
												<input
													name='customUrl'
													value={blog?.customUrl}
													onChange={(e) =>
														setBlog({
															...blog,
															customUrl: formatCustomUrl(e.target.value),
														})
													}
													placeholder='your-blog-url'
													className='focus:ring-colorTeal focus:border-colorTeal block w-full rounded-none rounded-r-md text-base py-3 border-2 border-gray-300 text-gray-900 px-3'
												/>
												{blog?.customUrl && (
													<div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-5 w-5 text-green-500'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M5 13l4 4L19 7'
															/>
														</svg>
													</div>
												)}
											</div>
										</div>
										<div className='mt-2 flex items-start'>
											<div className='flex-shrink-0'>
												<svg
													className='h-5 w-5 text-amber-400'
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 20 20'
													fill='currentColor'>
													<path
														fillRule='evenodd'
														d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
														clipRule='evenodd'
													/>
												</svg>
											</div>
											<p className='ml-3 text-sm text-gray-700 font-medium'>
												This will be used as the unique identifier for your
												blog. You cannot change this once the blog is created.
											</p>
										</div>
									</div>

									{/* Image Upload */}
									<div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700'>
										<div className='flex items-center justify-between mb-4'>
											<label className='block text-base font-medium text-gray-800 dark:text-darkText'>
												Featured Image
											</label>
											{previewUrl && (
												<button
													onClick={handleRemoveImage}
													className='inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='h-4 w-4 mr-1'
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
													Remove
												</button>
											)}
										</div>
										{previewUrl ? (
											<div className='relative rounded-lg overflow-hidden shadow-md border-2 border-gray-200 bg-white'>
												<img
													src={previewUrl}
													alt='Blog preview'
													className='w-full h-72 object-cover'
												/>
												<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4'>
													<div className='text-white text-sm font-medium'>
														Featured image preview
													</div>
												</div>
											</div>
										) : (
											<div
												className='group relative border-2 border-dashed border-gray-400 rounded-lg p-12 text-center hover:border-colorTeal transition-colors duration-200 cursor-pointer'
												onClick={() =>
													document.getElementById("file-upload").click()
												}>
												<div className='space-y-2'>
													<div className='mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-teal-50 transition-colors duration-200'>
														<svg
															className='h-10 w-10 text-gray-400 group-hover:text-colorTeal transition-colors duration-200'
															stroke='currentColor'
															fill='none'
															viewBox='0 0 48 48'>
															<path
																d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
																strokeWidth='2'
																strokeLinecap='round'
																strokeLinejoin='round'
															/>
														</svg>
													</div>
													<div className='flex text-sm text-gray-700 justify-center'>
														<label
															htmlFor='file-upload'
															className='relative cursor-pointer rounded-md font-medium text-colorTeal hover:text-teal-600 focus-within:outline-none'>
															<span>Upload an image</span>
															<input
																id='file-upload'
																name='file-upload'
																type='file'
																accept='image/*'
																onChange={handleImageChange}
																className='sr-only'
																disabled={loading}
															/>
														</label>
														<p className='pl-1'>or drag and drop</p>
													</div>
													<p className='text-xs text-gray-600'>
														PNG, JPG, GIF up to 10MB
													</p>
												</div>
											</div>
										)}
									</div>

									{/* Blog Status */}
									<div className='bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700'>
										<div className='flex items-center justify-between mb-3'>
											<label className='block text-base font-medium text-gray-800 dark:text-darkText'>
												Publication Status
											</label>
											<div
												className={`px-3 py-1 rounded-full text-sm font-medium ${
													blog.status === "published"
														? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
														: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
												}`}>
												{blog.status === "published" ? "Published" : "Draft"}
											</div>
										</div>

										<div className='space-y-3'>
											<p className='text-sm text-gray-700 dark:text-gray-300'>
												Choose whether to publish this blog immediately or save
												it as a draft.
											</p>

											<div className='flex items-center space-x-4'>
												<div className='flex items-center'>
													<input
														id='status-draft'
														name='status'
														type='radio'
														checked={blog.status === "draft"}
														onChange={() =>
															setBlog({ ...blog, status: "draft" })
														}
														className='h-4 w-4 text-colorTeal focus:ring-colorTeal border-gray-300'
													/>
													<label
														htmlFor='status-draft'
														className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
														Save as Draft
													</label>
												</div>
												<div className='flex items-center'>
													<input
														id='status-published'
														name='status'
														type='radio'
														checked={blog.status === "published"}
														onChange={() =>
															setBlog({ ...blog, status: "published" })
														}
														className='h-4 w-4 text-colorTeal focus:ring-colorTeal border-gray-300'
													/>
													<label
														htmlFor='status-published'
														className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
														Publish Immediately
													</label>
												</div>
											</div>
										</div>
									</div>

									{/* Content Editor */}
									<div>
										<div className='flex items-center justify-between mb-2'>
											<label className='block text-base font-medium text-gray-800 dark:text-darkText'>
												Blog Content
											</label>
											<div className='inline-flex text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-gray-700 dark:text-gray-300 items-center font-medium'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-4 w-4 mr-1'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M13 10V3L4 14h7v7l9-11h-7z'
													/>
												</svg>
												Visual Editor
											</div>
										</div>
										<div className='mt-1 rounded-md shadow-md overflow-hidden border-2 border-gray-300'>
											<GrapesEditor
												initialContent={outputHtml}
												initialState={editorState}
												onGetContent={handleGetEditorContent}
											/>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className='px-6 py-5 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3'>
							<Link to='/dashboard/blogs'>
								<button className='w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal transition-colors duration-200'>
									Cancel
								</button>
							</Link>
							<div className='flex gap-2'>
								<button
									className='w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-colorTeal bg-tealSoft dark:bg-gray-700 hover:bg-teal-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal transition-colors duration-200'
									onClick={() => {
										handleAddBlog(
											{
												...blog,
												summary: outputHtml,
												editorState: editorState,
												status: "draft",
											},
											"draft",
										);
									}}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 mr-1.5'
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
									Save Draft
								</button>
								<button
									className='w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-colorTeal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal transition-colors duration-200'
									onClick={() => {
										handleAddBlog(
											{
												...blog,
												summary: outputHtml,
												editorState: editorState,
												status: "published",
											},
											"published",
										);
									}}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 mr-1.5'
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
									Publish Blog
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddBlog;
