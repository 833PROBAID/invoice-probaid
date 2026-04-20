import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { ref, get, remove, set, push, update } from "firebase/database";
import { database } from "../../../Shared/firebaseConfig";
import Loading from "../../../Shared/Loading";
import ReactPlayer from "react-player";

const VideoManage = () => {
  const [listings, setListings] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const snapshot = await get(ref(database, "videos"));
      const data = snapshot.val();
      const loadedListings = [];
      for (const id in data) {
        loadedListings.push({ id, ...data[id] });
      }
      setListings(loadedListings);
    } catch (error) {
      console.error("Error fetching videos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load videos. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const openEditModal = (listing) => {
    setSelectedListing(listing);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedListing(null);
    setIsEditModalOpen(false);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure you want to delete this video?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await remove(ref(database, `videos/${id}`));
        fetchListings();
        Swal.fire({
          icon: "success",
          title: "Listing Deleted",
          text: "The video has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting video:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete video. Please try again later.",
        });
      }
    }
  };

  const handleSaveEdit = async (updatedListing) => {
    try {
      await update(
        ref(database, `videos/${updatedListing.id}`),
        updatedListing,
      );
      fetchListings();
      closeEditModal();
      Swal.fire({
        icon: "success",
        title: "Video Updated",
        text: "The video has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating video:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update video. Please try again later.",
      });
    }
  };

  const handleAddListing = async (newListing) => {
    try {
      const newListingRef = push(ref(database, "videos"));
      await set(newListingRef, newListing);
      fetchListings();
      closeAddModal();
      Swal.fire({
        icon: "success",
        title: "Listing Added",
        text: "The new video has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding video:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add new video. Please try again later.",
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 dark:bg-darkBackground min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-colorTeal to-teal-500 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Video Management
              </h1>
              <p className="mt-1 text-base text-white">
                View, edit, and manage your video content
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent bg-white text-sm font-medium rounded-md text-teal-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-teal-500 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Video
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-8">
        <div className="bg-white dark:bg-darkBackground rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-darkText">
                  Your Videos ({listings.length})
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage and organize your video content
                </p>
              </div>
            </div>

            {listings.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-darkText">
                  No videos found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Get started by adding a new video.
                </p>
                <div className="mt-6">
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-colorTeal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Video
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900">
                      <ReactPlayer
                        url={listing.link}
                        width="100%"
                        height="100%"
                        className="rounded-t-lg"
                        light={true}
                        controls={true}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-darkText mb-2 truncate">
                        {listing.title || "Untitled Video"}
                      </h3>
                      <div className="flex mt-4 space-x-3">
                        <button
                          onClick={() => openEditModal(listing)}
                          className="text-colorTeal hover:text-teal-700 dark:hover:text-teal-500 transition-colors duration-200"
                        >
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            <span className="ml-1">Edit</span>
                          </span>
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-500 transition-colors duration-200"
                        >
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            <span className="ml-1">Delete</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Components */}
      {isEditModalOpen && (
        <EditModal
          listing={selectedListing}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}

      {isAddModalOpen && (
        <AddModal onClose={closeAddModal} onSave={handleAddListing} />
      )}
    </div>
  );
};

const EditModal = ({ listing, onClose, onSave }) => {
  const [editedListing, setEditedListing] = useState(listing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedListing({ ...editedListing, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedListing);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-darkText mb-4 text-center">
          Edit Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                name="title"
                value={editedListing.title}
                onChange={handleChange}
                placeholder="Video title"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-colorTeal focus:border-colorTeal dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link
              </label>
              <input
                name="link"
                value={editedListing.link}
                onChange={handleChange}
                placeholder="Video URL (YouTube, Vimeo, etc.)"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-colorTeal focus:border-colorTeal dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-colorTeal text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddModal = ({ onClose, onSave }) => {
  const [newListing, setNewListing] = useState({
    title: "",
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewListing({ ...newListing, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newListing);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-darkText mb-4 text-center">
          Add New Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                name="title"
                value={newListing.title}
                onChange={handleChange}
                placeholder="Video title"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-colorTeal focus:border-colorTeal dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Link
              </label>
              <input
                name="link"
                value={newListing.link}
                onChange={handleChange}
                placeholder="Video URL (YouTube, Vimeo, etc.)"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-colorTeal focus:border-colorTeal dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-colorTeal text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colorTeal transition-colors duration-200"
            >
              Add Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoManage;
