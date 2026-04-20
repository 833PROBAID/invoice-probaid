import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ref, get, remove } from "firebase/database";
import { database } from "../../../Shared/firebaseConfig";
import Loading from "../../../Shared/Loading";

const DownloadRequestsPage = () => {
    const [downloadRequests, setDownloadRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloadRequests = async () => {
            try {
                setLoading(true); // Start loading
                const snapshot = await get(ref(database, "downloadRequests"));
                const data = snapshot.val();
                const loadedRequests = [];
                for (const id in data) {
                    loadedRequests.push({ id, ...data[id] });
                }
                setDownloadRequests(loadedRequests);
            } catch (error) {
                console.error("Error fetching download requests:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load download requests. Please try again later.",
                });
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchDownloadRequests();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure you want to delete this download request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                await remove(ref(database, `downloadRequests/${id}`));
                setDownloadRequests(downloadRequests.filter((req) => req.id !== id));

                Swal.fire({
                    icon: "success",
                    title: "Download Request Deleted",
                    text: "The download request has been successfully deleted.",
                });
            } catch (error) {
                console.error("Error deleting download request:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete download request. Please try again later.",
                });
            }
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
                            <h1 className='text-3xl font-bold text-white'>Download Requests</h1>
                            <p className='mt-1 text-base text-white'>
                                Manage user download requests and leads
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className='py-8'>
                <div className='bg-white dark:bg-darkBackground rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-8'>
                    <div className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <div>
                                <h2 className='text-xl font-semibold text-gray-900 dark:text-darkText'>
                                    Download Request List ({downloadRequests.length})
                                </h2>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                    View and manage requests from users interested in your content
                                </p>
                            </div>
                        </div>

                        {downloadRequests.length === 0 ? (
                            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700'>
                                <svg
                                    className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10'
                                    />
                                </svg>
                                <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-darkText'>
                                    No download requests yet
                                </h3>
                                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                    When users request downloads, they will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                                    <thead className='bg-gray-50 dark:bg-gray-800'>
                                        <tr>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Name
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Email
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Phone
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Needs
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Message
                                            </th>
                                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className='bg-white dark:bg-darkBackground divide-y divide-gray-200 dark:divide-gray-700'>
                                        {downloadRequests.map((request) => (
                                            <tr 
                                                key={request.id}
                                                className='hover:bg-gray-50 dark:hover:bg-gray-800'
                                            >
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm font-medium text-gray-900 dark:text-darkText'>
                                                        {request.firstName} {request.lastName}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-gray-700 dark:text-gray-300'>
                                                        {request.email}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-gray-700 dark:text-gray-300'>
                                                        {request.phone}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='text-sm text-gray-700 dark:text-gray-300'>
                                                        {request.needs?.map((need, index) => (
                                                            <span
                                                                key={index}
                                                                className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tealSoft text-colorTeal dark:bg-teal-900 dark:text-teal-200 mr-1 mb-1'
                                                            >
                                                                {need}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate'>
                                                        {request.message}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className='text-red-600 hover:text-red-800 dark:hover:text-red-500 transition-colors duration-200'>
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
                                                            <span className='ml-1'>Remove</span>
                                                        </span>
                                                    </button>
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

export default DownloadRequestsPage;
