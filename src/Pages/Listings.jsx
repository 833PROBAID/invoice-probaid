import { Link } from "react-router-dom";
import Loading from "../Shared/Loading";
import Swal from "sweetalert2";
import { ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../Shared/firebaseConfig";
import Seo from "../Components/SEO";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const snapshot = await get(ref(database, "listings"));
        const data = snapshot.val();
        const loadedListings = [];
        for (const id in data) {
          loadedListings.push({ id, ...data[id] });
        }
        setListings(loadedListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load listings. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Seo
        title="Available Probate Property Listings"
        description="Browse our current probate property listings. Find opportunities in probate real estate with detailed property information and competitive prices."
        pathname="/listings"
      />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div></div>
        <h1 className="text-3xl font-bold text-colorTeal mb-8 text-center">
          Available Listings
        </h1>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id}>
              {listing?.type === "auto" ? (
                <>
                  <Preview url={listing.listingURL} />
                </>
              ) : (
                <div className="bg-tealSoft bg-opacity-40 rounded-lg shadow-lg border border-tealSoft transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={listing.imageUrl}
                      alt="Listing"
                      className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-colorOrangeLight text-white font-semibold py-1 px-3 rounded-full text-xs shadow">
                      Sold
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-colorOrange mb-2">
                      {listing.address}
                    </h2>
                    <p className="text-gray-600">
                      {listing.bedrooms} Beds | {listing.bathrooms} Baths |{" "}
                      {listing.squareFeet} Sq Ft
                    </p>
                    <p className="text-gray-500 mt-1">
                      Sold Price:{" "}
                      <span className="font-semibold">{listing.soldPrice}</span>
                    </p>

                    <Link
                      to={`/listings/${listing.id}`}
                      className="inline-block mt-4 px-4 py-2 bg-colorTeal text-white font-semibold rounded-lg shadow-lg transition-colors duration-300 hover:bg-colorOrange hover:shadow-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Listings;

const Preview = ({ url }) => {
  const [preview, setPreview] = useState(null);

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
      }
    } catch (error) {
      console.error("Error fetching link preview:", error);
    }
  };

  useEffect(() => {
    if (url) {
      fetchLinkPreview(url);
    }
  }, [url]);

  if (!preview) {
    return <p>Loading preview...</p>;
  }

  return (
    <div className="bg-tealSoft bg-opacity-40 rounded-lg shadow-lg border border-tealSoft transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
      <div className="relative overflow-hidden rounded-t-lg">
        {preview.image && (
          <img
            src={preview.image.url}
            alt={preview.title}
            className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
          />
        )}
        <div className="absolute top-2 right-2 bg-colorOrangeLight text-white font-semibold py-1 px-3 rounded-full text-xs shadow">
          Preview
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold text-colorOrange mb-2">
          {preview.title}
        </h2>
        <p className="text-gray-600">
          {preview.description || "No description available."}
        </p>
        <a
          href={preview.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-4 px-4 py-2 bg-colorTeal text-white font-semibold rounded-lg shadow-lg transition-colors duration-300 hover:bg-colorOrange hover:shadow-xl"
        >
          Visit Link
        </a>
      </div>
    </div>
  );
};
